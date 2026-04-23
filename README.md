# Pakistan Post Tracker 📦

A modern, AI-powered parcel tracking chatbot for Pakistan Post. Track your parcels in real-time with a conversational interface.

![Pakistan Post Tracker](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

## ✨ Features

- 🤖 **AI-Powered Responses** - Powered by Groq LLM for natural language understanding
- 💬 **Chat Interface** - Clean, WhatsApp-style chat UI
- 📍 **Real-time Tracking** - Track parcels across Pakistan
- 🎯 **Demo Mode** - Built-in dummy data for testing (IDs: B25330 - B2533049)
- 🌐 **Bilingual Support** - Works in both English and Urdu/Roman Urdu
- ⚡ **Fast & Lightweight** - No framework dependencies, pure vanilla JS

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/kasa-maker/PakTrackAI.git
cd pakistan-post-tracker
```

### 2. Configure API Keys

Open `config.js` and add your API keys:

```javascript
const CONFIG = {
  GROQ_API_KEY: "your_groq_api_key_here",
  TRACKINGMORE_API_KEY: "your_trackingmore_api_key_here",
};
```

**Get API Keys:**
- [Groq API Key](https://console.groq.com/)
- [TrackingMore API Key](https://www.trackingmore.com/)

### 3. Run the Application

Simply open `index.html` in your browser:

```bash
# Option 1: Double-click the file
# Option 2: Use a local server
npx serve .
# or
python -m http.server 8000
```

Then navigate to `http://localhost:8000`

## 📖 Usage

1. **Enter a Tracking Number** - Type any Pakistan Post tracking number (e.g., `B2533044`)
2. **View Details** - Get instant tracking information:
   - Current location
   - Status (In Transit, Delivered, etc.)
   - Dispatch date
   - Expected delivery
   - Tracking history

3. **Demo Mode** - Try demo IDs from `B25330` to `B2533049` without API keys

### Example Output

```
📦 Tracking Details:
• ID: B2533044
• Current Location: Lahore
• Status: In Transit
• Origin: Karachi
• Dispatch Date: 2026-04-15
• Expected Delivery: 2026-04-25
• Weight: 2.5 kg

📍 Recent Activity:
• 2026-04-20 - In transit to destination (Lahore)
• 2026-04-18 - In transit to destination (Karachi)
• 2026-04-15 - Parcel received at origin facility (Karachi)
```

## 📁 Project Structure

```
pakistan-post-tracker/
├── index.html      # Main HTML file
├── style.css       # Styles and animations
├── app.js          # Main application logic
├── tracker.js      # Tracking API & dummy data generator
├── groq.js         # Groq AI integration
├── config.js       # API configuration
└── README.md       # Documentation
```

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **AI:** Groq API (Llama 3.3 70B)
- **Tracking:** TrackingMore API (Pakistan Post)
- **Design:** Custom chat-based UI

## 🎨 UI Features

- Modern gradient backgrounds
- Smooth typing animations
- Responsive design (mobile-friendly)
- Clean message bubbles
- Real-time status indicators

## 🔧 Configuration

### Changing the Color Theme

Edit `style.css` to customize colors:

```css
/* Primary color (currently green) */
.chat-header { background: #1a5f2e; }
.user .bubble { background: #1a5f2e; }
```

### Adding More Demo IDs

Edit the range in `tracker.js`:

```javascript
// Valid range: B25330 to B2533049
if (!numPart || num < 25330 || num > 2533049) {
```

## 📝 API Endpoints

| Service | Endpoint | Purpose |
|---------|----------|---------|
| Groq | `https://api.groq.com/openai/v1/chat/completions` | AI responses |
| TrackingMore | `https://api.trackingmore.com/v4/trackings/` | Parcel tracking |

## 🐛 Troubleshooting

**No response from bot:**
- Check internet connection
- Verify API keys in `config.js`
- Open browser console for errors

**Demo IDs not working:**
- Clear browser cache
- Ensure ID format is correct (e.g., `B2533044`)

**Groq API errors:**
- Check rate limits (free tier: 30 req/min)
- Verify API key is active

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues and feature requests, please create an issue on GitHub.

---

**Made with ❤️ for Pakistan Post**
