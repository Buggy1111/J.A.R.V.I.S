
// --------------------------------------------------
//  J.A.R.V.I.S. content-autoscroll.js
//  Kompletní skript s automatickým scrollováním
//  a konstantou STORAGE_KEY definovanou nahoře
// --------------------------------------------------

const STORAGE_KEY = "conversationHistory";

if (!window.chatWindowInitialized) {
  window.chatWindowInitialized = true;

  let chatWindow = null;
  let conversationHistory = loadConversation();

  // --------------------------------------------------
  //  VYTVOŘENÍ CHAT OKNA
  // --------------------------------------------------
  function createChatWindow() {
    if (!document.body) return;

    chatWindow = document.createElement("div");
    chatWindow.className = "gpt-vision-chat";
    chatWindow.innerHTML = getChatWindowHTML();
    document.body.appendChild(chatWindow);

    initializeChatEvents();
    renderConversationHistory();
    makeDraggable(chatWindow);

    // instalace autoscrollu
    installAutoScroll(chatWindow.querySelector("#chat-messages"));
  }

  // --------------------------------------------------
  //  PŘIDÁNÍ LISTENERŮ
  // --------------------------------------------------
  function initializeChatEvents() {
    const sendBtn  = chatWindow.querySelector(".chat-send-btn");
    const input    = chatWindow.querySelector(".chat-input");
    const log      = chatWindow.querySelector("#chat-messages");
    const minimize = chatWindow.querySelector(".chat-minimize-btn");
    const clearBtn = chatWindow.querySelector(".chat-clear-btn");

    sendBtn.addEventListener("click", () => sendMessage(input, log));
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input, log);
      }
    });

    minimize.addEventListener("click", () => {
      chatWindow.classList.toggle("minimized");
      minimize.textContent = chatWindow.classList.contains("minimized") ? "+" : "_";
    });

    clearBtn.addEventListener("click", () => {
      if (confirm("Opravdu chcete vymazat celou historii?")) {
        conversationHistory = [];
        saveConversation();
        log.innerHTML = "";
      }
    });
  }

  // --------------------------------------------------
  //  DRAG & DROP OKNA
  // --------------------------------------------------
  function makeDraggable(el) {
    const header = el.querySelector(".chat-header");
    if (!header) return;
    header.style.cursor = "move";
    let drag = false, oX = 0, oY = 0;
    header.addEventListener("mousedown", e => {
      drag = true;
      const rect = el.getBoundingClientRect();
      oX = e.clientX - rect.left;
      oY = e.clientY - rect.top;
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });
    function move(e) {
      if (!drag) return;
      el.style.left = `${e.clientX - oX}px`;
      el.style.top  = `${e.clientY - oY}px`;
    }
    function up() {
      drag = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    }
  }

  // --------------------------------------------------
  //  ODESLÁNÍ ZPRÁVY
  // --------------------------------------------------
  function sendMessage(input, log) {
    const txt = input.value.trim();
    if (!txt) return;
    addMessage("user", txt, log);
    input.value = "";

    const typing = document.getElementById("typing-indicator");
    typing.style.display = "block";

    fetch("https://hook.eu2.make.com/d67pb8kj314v0ivfir5nvbr3ko7i5yku", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: txt })
    })
      .then(r => r.headers.get("content-type")?.includes("application/json") ? r.json() : r.text())
      .then(d => {
        typing.style.display = "none";
        const reply = typeof d === "object" ? d.reply || "Odpověď z API není specifikována." : d;
        addMessage("assistant", reply || "Server vrátil prázdnou odpověď.", log);
      })
      .catch(err => {
        typing.style.display = "none";
        console.error("API error:", err);
        addMessage("assistant", "Došlo k chybě při získávání odpovědi.", log);
      });
  }

  // --------------------------------------------------
  //  PŘIDÁNÍ ZPRÁVY DO DOM + SCROLL DOLŮ
  // --------------------------------------------------
  function addMessage(sender, content, container) {
    const el = document.createElement("div");
    el.className = `chat-message ${sender}`;
    el.textContent = content;
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
    conversationHistory.push({ sender, content });
    saveConversation();
  }

  // --------------------------------------------------
  //  VYKRESLENÍ HISTORIE
  // --------------------------------------------------
  function renderConversationHistory() {
    const log = chatWindow.querySelector("#chat-messages");
    log.innerHTML = "";
    conversationHistory.forEach(({ sender, content }) => {
      const el = document.createElement("div");
      el.className = `chat-message ${sender}`;
      el.textContent = content;
      log.appendChild(el);
    });
    log.scrollTop = log.scrollHeight;
  }

  // --------------------------------------------------
  //  LOCAL STORAGE
  // --------------------------------------------------
  function saveConversation() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
  }
  function loadConversation() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }

  // --------------------------------------------------
  //  HTML ŠABLONA
  // --------------------------------------------------
  function getChatWindowHTML() {
    return `<div class="chat-header" role="banner">
      <h3>J.A.R.V.I.S. Asistent</h3>
      <button class="chat-minimize-btn" aria-label="Minimalizovat chat">_</button>
      <button class="chat-clear-btn" aria-label="Vymazat historii">🗑️</button>
    </div>
    <div class="chat-body"><div id="chat-messages" role="log" aria-live="polite"></div>
      <div id="typing-indicator" class="chat-typing-indicator" style="display:none;">J.A.R.V.I.S. píše…</div>
    </div>
    <div class="chat-footer"><textarea class="chat-input" placeholder="Napište zprávu…" rows="2"></textarea>
      <button class="chat-send-btn" aria-label="Odeslat zprávu">➞</button></div>`;
  }

  // --------------------------------------------------
  //  START
  // --------------------------------------------------
  createChatWindow();
}

// --------------------------------------------------
//  MUTATION OBSERVER – Auto-scroll vždy na spodní okraj
// --------------------------------------------------
function installAutoScroll(container) {
  if (!container) return;
  new MutationObserver(() => {
    container.scrollTop = container.scrollHeight;
  }).observe(container, { childList: true });
}
