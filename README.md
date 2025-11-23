# 🍿 Entertainment Picker

An AI-powered entertainment recommendation app that suggests movies, TV series, anime, and web shows based on your preferences using Google's Gemini AI.

## 📁 Project Structure

```
Entertainer/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling and animations
├── js/
│   ├── app.js          # Main application logic and state management
│   ├── config.js       # Configuration and genre data
│   ├── api.js          # API communication with Gemini
│   └── ui.js           # UI rendering and DOM manipulation
├── assets/             # Future assets (images, icons, etc.)
└── README.md           # Project documentation
```

## ✨ Features

- **Multiple Content Types**: Movies, TV Series, Anime, and Web Shows
- **Genre Selection**: Choose from curated genre lists or get surprise recommendations
- **Smart History**: Tracks viewed titles to avoid duplicate suggestions
- **IMDb Ratings**: Shows ratings for each recommendation
- **Streaming Platforms**: Displays where to watch each title
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Easy on the eyes with a modern dark interface

## 🚀 Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. (Optional) Add your own Gemini API key if the default one doesn't work

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Styling**: Tailwind CSS
- **API**: Google Gemini AI with Search Grounding
- **Architecture**: Modular ES6 with separation of concerns

## 📦 Modules

- **app.js**: Main application class, manages state and coordinates between modules
- **config.js**: Configuration constants and genre definitions
- **api.js**: Handles all API calls to Gemini AI
- **ui.js**: Manages all DOM manipulation and rendering

## 🎨 Customization

You can easily customize:
- Add new genres in `js/config.js`
- Modify styling in `css/style.css`
- Change AI model or prompts in `js/api.js`

## 📝 License

MIT License - Feel free to use and modify!
