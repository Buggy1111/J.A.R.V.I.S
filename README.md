# 🤖 J.A.R.V.I.S. AI Assistant

**Chrome Extension that injects an AI-powered chat interface into any webpage.**

> Built in **2022** - before the ChatGPT era - as an exploration of browser-based AI assistants.

![Iron Man themed chat interface](screenshot.png)

---

## ✨ Features

### Core Functionality
- 💬 **Universal Chat Interface** - Appears on any website via content injection
- 🎯 **Draggable Modal** - Move it anywhere on screen with smooth drag-and-drop
- 📦 **Conversation Persistence** - History saved in LocalStorage across sessions
- 🔄 **Real-time AI Integration** - Connected to Make.com webhook for AI responses
- 📱 **Fully Responsive** - Adapts to mobile screens (< 600px)
- ♿ **Accessibility** - ARIA labels, semantic HTML, keyboard navigation

### UI/UX
- 🔴 **Iron Man Theme** - Gradient background with gold accents
- ✨ **Smooth Animations** - Slide-in, scanline effects, message fade-ins
- 🎨 **Typing Indicator** - Shows when AI is "thinking"
- 🗑️ **Clear History** - One-click conversation reset
- ➖ **Minimize Mode** - Collapse to 50px bar with pulsing glow

---

## 🛠️ Tech Stack

**Built with pure Vanilla JavaScript** - no frameworks!

- **Manifest V3** - Modern Chrome Extension standard
- **Content Scripts** - DOM injection across all websites
- **Background Service Worker** - Handles extension lifecycle
- **LocalStorage API** - Client-side persistence
- **Fetch API** - Async communication with AI backend
- **Mutation Observer** - Auto-scroll on new messages
- **CSS Animations** - Keyframes, transforms, gradients
- **Responsive Design** - Media queries for mobile

---

## 🚀 Installation

### Load Unpacked (Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/Buggy1111/jarvis.git
   cd jarvis
   ```

2. Open Chrome → `chrome://extensions/`

3. Enable **Developer mode** (top right)

4. Click **Load unpacked** → Select the `Jarvis` folder

5. Extension is now active! 🎉

---

## 🎮 Usage

### Open Chat
- Click the J.A.R.V.I.S. icon in Chrome toolbar
- Chat window slides in from bottom-right
- Type your message and press Enter

### Drag & Drop
- Grab the header (Iron Man logo) and drag anywhere
- Position is preserved while browsing

### Minimize
- Click the `_` button to collapse to 50px
- Pulses with golden glow when minimized
- Click `+` to restore

### Clear History
- Click 🗑️ to delete all conversation history
- Confirmation dialog prevents accidental deletion

---

## 📂 File Structure

```
Jarvis/
├── manifest.json          # Extension configuration (Manifest V3)
├── background.js          # Service worker for extension lifecycle
├── content.js             # Main chat logic & DOM injection
├── popup.html             # Extension popup interface
├── popup.js               # Popup interaction logic
├── styles.css             # Iron Man themed styling
└── icon.png              # Extension icon
```

---

## 🔧 How It Works

### 1. **Content Injection**
When you open a webpage, `background.js` automatically injects `content.js`:
```javascript
chrome.scripting.executeScript(
  { target: { tabId: tabId }, files: ["content.js"] }
);
```

### 2. **Chat Window Creation**
`content.js` creates a modal using `document.createElement()`:
```javascript
chatWindow = document.createElement("div");
chatWindow.className = "gpt-vision-chat";
chatWindow.innerHTML = getChatWindowHTML();
document.body.appendChild(chatWindow);
```

### 3. **Draggable Functionality**
Custom drag-and-drop implementation:
```javascript
header.addEventListener("mousedown", (event) => {
  isDragging = true;
  offsetX = event.clientX - element.getBoundingClientRect().left;
  // ... calculate position on mousemove
});
```

### 4. **AI Communication**
Sends messages to Make.com webhook:
```javascript
fetch("https://hook.eu2.make.com/...", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: userMessage })
})
```

### 5. **Persistence**
Conversation history stored in LocalStorage:
```javascript
localStorage.setItem("conversationHistory", JSON.stringify(conversationHistory));
```

---

## 🎨 Design Philosophy

**Iron Man Aesthetic** 🔴🟡

- **Red gradient background** (`#ff0000` → `#8b0000`)
- **Gold accents** (`#ffd700` borders and buttons)
- **Scanline animation** - Subtle diagonal gradient movement
- **Glow effects** - Box shadows and pulsing animations
- **Smooth transitions** - 0.3s ease on all interactions

---

## 🔒 Security & Privacy

- **Client-side only** - No data sent to third parties (except configured webhook)
- **LocalStorage** - Conversations stay on your device
- **No tracking** - No analytics or user monitoring
- **Open source** - Inspect the code yourself

---

## 📝 Configuration

### Change AI Backend

Edit `content.js` line 100:
```javascript
fetch("YOUR_WEBHOOK_URL", {
  method: "POST",
  // ... rest of config
})
```

### Customize Styling

Edit `styles.css`:
```css
:root {
  --iron-red: #8b0000;
  --iron-gold: #ffd700;
  --energy-core: #ff4500;
}
```

---

## 🐛 Known Issues

- **Chrome internal pages** - Cannot inject on `chrome://` URLs (browser limitation)
- **Devtools pages** - Cannot inject on `devtools://` (browser limitation)
- **Mobile touch** - Drag-and-drop uses mouse events (needs touch support)

---

## 🚧 Roadmap

- [ ] Touch support for mobile dragging
- [ ] Voice input integration (Web Speech API)
- [ ] Customizable themes (light/dark/custom)
- [ ] Keyboard shortcuts (Ctrl+Shift+J)
- [ ] Export conversation to text/PDF
- [ ] Multiple AI backend options

---

## 📜 License

MIT License - free to use, modify, and distribute.

---

## 👨‍💻 Author

**Michal Bürgermeister**
- GitHub: [@Buggy1111](https://github.com/Buggy1111)
- Portfolio: [portfolio-web-two-mu.vercel.app](https://portfolio-web-two-mu.vercel.app/)
- LinkedIn: [Michal Bürgermeister](https://www.linkedin.com/in/michal-burgermeister-889b10340/)

---

## 🙏 Acknowledgments

Built in **2022** as a personal project exploring:
- Browser extension development
- AI chat interfaces
- Vanilla JavaScript patterns
- CSS animation techniques

**Fun fact:** This was created *before* ChatGPT's public release - an early experiment in browser-based AI assistants!

---

## 🌟 Star History

If you found this useful, please give it a star! ⭐

---

**Part of my developer journey from Chrome Extensions (2022) → Full-stack apps (2024-2025)**
