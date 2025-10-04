document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup byl úspěšně načten.");

  const openChatBtn = document.getElementById("open-chat");

  if (openChatBtn) {
    openChatBtn.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openChat" }, (response) => {
        if (chrome.runtime.lastError) {
          alert("Došlo k chybě při komunikaci s background.js.");
        } else if (response.success) {
          alert("Chat byl úspěšně otevřen.");
        } else {
          alert("Došlo k chybě: " + response.error);
        }
      });
    });
  }

  // Přidání dalších funkcí, např. přepínač režimu
  const toggleThemeBtn = document.createElement("button");
  toggleThemeBtn.textContent = "Přepnout režim";
  toggleThemeBtn.style.marginTop = "10px";
  toggleThemeBtn.style.width = "100%";
  toggleThemeBtn.style.height = "40px";
  toggleThemeBtn.style.backgroundColor = "#555";
  toggleThemeBtn.style.color = "#fff";
  toggleThemeBtn.style.borderRadius = "20px";
  toggleThemeBtn.style.cursor = "pointer";

  toggleThemeBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "toggleTheme" }, (response) => {
      if (response.success) {
        alert("Režim byl přepnut.");
      } else {
        alert("Nepodařilo se přepnout režim.");
      }
    });
  });

  document.querySelector(".popup-container").appendChild(toggleThemeBtn);
});