if (!window.chatWindowInitialized) {
  window.chatWindowInitialized = true;

  let chatWindow = null;
  let conversationHistory = loadConversation();

  console.log("Spouštím content.js na stránce:", window.location.href);

  function createChatWindow() {
    console.log("Vytvářím chatovací okno...");

    if (!document.body) {
      console.error("Tělo stránky není dostupné.");
      return;
    }

    chatWindow = document.createElement("div");
    chatWindow.className = "gpt-vision-chat";
    chatWindow.innerHTML = getChatWindowHTML();
    document.body.appendChild(chatWindow);
    console.log("Chatovací okno bylo přidáno na stránku.");

    initializeChatEvents();
    renderConversationHistory();
    makeDraggable(chatWindow);
  }

  function initializeChatEvents() {
    const sendButton = chatWindow.querySelector(".chat-send-btn");
    const inputField = chatWindow.querySelector(".chat-input");
    const messagesContainer = chatWindow.querySelector("#chat-messages");
    const minimizeButton = chatWindow.querySelector(".chat-minimize-btn");
    const clearHistoryButton = chatWindow.querySelector(".chat-clear-btn");

    sendButton.addEventListener("click", () => sendMessage(inputField, messagesContainer));
    inputField.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage(inputField, messagesContainer);
      }
    });

    minimizeButton.addEventListener("click", () => {
      chatWindow.classList.toggle("minimized");
      minimizeButton.textContent = chatWindow.classList.contains("minimized") ? "+" : "_";
    });

    clearHistoryButton.addEventListener("click", () => {
      if (confirm("Opravdu chcete vymazat celou historii?")) {
        clearConversationHistory(messagesContainer);
      }
    });
  }

  function makeDraggable(element) {
    const header = element.querySelector(".chat-header");
    if (!header) return;

    header.style.cursor = "move";
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener("mousedown", (event) => {
      isDragging = true;
      offsetX = event.clientX - element.getBoundingClientRect().left;
      offsetY = event.clientY - element.getBoundingClientRect().top;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(event) {
      if (!isDragging) return;

      const left = event.clientX - offsetX;
      const top = event.clientY - offsetY;

      element.style.position = "fixed";
      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  }

  function sendMessage(inputField, messagesContainer) {
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    addMessage("user", userMessage, messagesContainer);
    inputField.value = "";

    const typingIndicator = document.getElementById("typing-indicator");
    typingIndicator.style.display = "block";

    fetch("https://hook.eu2.make.com/d67pb8kj314v0ivfir5nvbr3ko7i5yku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    })
      .then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then(data => {
        typingIndicator.style.display = "none";

        const replyMessage = (typeof data === "object") 
          ? data.reply || "Odpověď z API není specifikována." 
          : data || "Server vrátil prázdnou odpověď.";

        addMessage("assistant", replyMessage, messagesContainer);
      })
      .catch(error => {
        typingIndicator.style.display = "none";
        console.error("Chyba při komunikaci s API:", error.message);
        addMessage("assistant", "Došlo k chybě při získávání odpovědi.", messagesContainer);
      });
  }

  function addMessage(sender, content, messagesContainer) {
    const messageElement = document.createElement("div");
    messageElement.className = `chat-message ${sender}`;
    messageElement.textContent = content;
    messagesContainer.appendChild(messageElement);

    scrollToBottom(messagesContainer);

    conversationHistory.push({ sender, content });
    saveConversation();
  }

  function scrollToBottom(container) {
    setTimeout(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }, 100);
  }

  function renderConversationHistory() {
    const messagesContainer = chatWindow.querySelector("#chat-messages");
    messagesContainer.innerHTML = "";
    conversationHistory.forEach(({ sender, content }) => {
      const messageElement = document.createElement("div");
      messageElement.className = `chat-message ${sender}`;
      messageElement.textContent = content;
      messagesContainer.appendChild(messageElement);
    });
    scrollToBottom(messagesContainer);
  }

  function saveConversation() {
    localStorage.setItem("conversationHistory", JSON.stringify(conversationHistory));
  }

  function loadConversation() {
    return JSON.parse(localStorage.getItem("conversationHistory")) || [];
  }

  function clearConversationHistory(messagesContainer) {
    conversationHistory = [];
    saveConversation();
    messagesContainer.innerHTML = "";
  }

  function getChatWindowHTML() {
    return `
      <div class="chat-header" role="banner">
        <h3>J.A.R.V.I.S. Asistent</h3>
        <button class="chat-minimize-btn" aria-label="Minimalizovat chat">_</button>
        <button class="chat-clear-btn" aria-label="Vymazat historii">🗑️</button>
      </div>
      <div class="chat-body">
        <div id="chat-messages" role="log" aria-live="polite"></div>
        <div id="typing-indicator" class="chat-typing-indicator" style="display: none;">
          J.A.R.V.I.S. píše<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
        </div>
      </div>
      <div class="chat-footer">
        <textarea class="chat-input" placeholder="Napište zprávu..." rows="2"></textarea>
        <button class="chat-send-btn" aria-label="Odeslat zprávu">➞</button>
      </div>
    `;
  }

  createChatWindow();
}

// --- Auto-scroll observer ---
function installAutoScroll(container) {
  if (!container) return;
  const config = { childList: true };
  const observer = new MutationObserver(() => {
    container.scrollTop = container.scrollHeight;
  });
  observer.observe(container, config);
}
// ----------------------------
