// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Přijata zpráva:", request.action);

  if (request.action === "openChat") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        console.log("Spouštím chatovací okno na stránce:", currentTab.url);

        chrome.scripting.executeScript(
          { target: { tabId: currentTab.id }, files: ["content.js"] },
          () => {
            if (chrome.runtime.lastError) {
              console.error("Chyba při injekci content.js:", chrome.runtime.lastError.message);
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
              console.log("Chatovací skript byl úspěšně spuštěn.");
              sendResponse({ success: true });
            }
          }
        );
      } else {
        sendResponse({ success: false, error: "Nepodařilo se získat aktuální záložku." });
      }
    });
    return true; // Asynchronní odpověď
  }

  if (request.action === "toggleTheme") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        chrome.scripting.executeScript(
          {
            target: { tabId: currentTab.id },
            func: () => {
              const isDarkMode = document.body.classList.toggle("dark-mode");
              return isDarkMode;
            },
          },
          (results) => {
            if (chrome.runtime.lastError) {
              console.error("Chyba při přepínání režimu:", chrome.runtime.lastError.message);
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
              console.log("Režim byl přepnut na:", results[0].result ? "tmavý" : "světlý");
              sendResponse({ success: true });
            }
          }
        );
      } else {
        sendResponse({ success: false, error: "Nepodařilo se získat aktuální záložku." });
      }
    });
    return true; // Asynchronní odpověď
  }

  sendResponse({ error: "Neznámá akce." });
});

/**
 * Automaticky přidá obsahový skript a styly na povolené stránky při jejich načtení.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    !tab.url.startsWith("chrome://") &&
    !tab.url.startsWith("devtools://")
  ) {
    console.log("Automaticky injektuji skripty na stránku:", tab.url);

    chrome.scripting.executeScript(
      { target: { tabId: tabId }, files: ["content.js"] },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Chyba při automatické injekci content.js:", chrome.runtime.lastError.message);
        } else {
          console.log("content.js byl automaticky injektován.");
        }
      }
    );

    chrome.scripting.insertCSS(
      { target: { tabId: tabId }, files: ["styles.css"] },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Chyba při automatické injekci styles.css:", chrome.runtime.lastError.message);
        } else {
          console.log("styles.css byl automaticky injektován.");
        }
      }
    );
  }
});

/**
 * Přidá obsahový skript do všech otevřených tabů při spuštění rozšíření.
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("devtools://")) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: ["content.js"]
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error("Chyba při vkládání content.js při spuštění:", chrome.runtime.lastError.message);
            } else {
              console.log("content.js byl vložen při spuštění na stránku:", tab.url);
            }
          }
        );

        chrome.scripting.insertCSS(
          {
            target: { tabId: tab.id },
            files: ["styles.css"]
          },
          () => {
            if (chrome.runtime.lastError) {
              console.error("Chyba při vkládání styles.css při spuštění:", chrome.runtime.lastError.message);
            } else {
              console.log("styles.css byl vložen při spuštění na stránku:", tab.url);
            }
          }
        );
      }
    });
  });
});
