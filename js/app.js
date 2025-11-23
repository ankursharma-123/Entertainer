import { GENRES_BY_TYPE } from './config.js';
import { UIManager } from './ui.js';
import { APIManager } from './api.js';

// Application State
class App {
    constructor() {
        this.selectionHistory = [];
        this.currentType = 'Movies';
        this.ui = new UIManager();
        this.api = new APIManager();
        this.init();
    }

    init() {
        this.updateHistoryCount();
        const savedKey = localStorage.getItem('gemini_user_api_key');
        if (savedKey) this.ui.userApiKeyInput.value = savedKey;
        
        this.populateGenres(this.currentType);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Make functions globally accessible for onclick handlers
        window.selectType = (type) => this.selectType(type);
        window.processSelection = () => this.processSelection();
        window.clearHistory = () => this.clearHistory();
        window.saveKeyAndRetry = () => this.saveKeyAndRetry();
    }

    selectType(type) {
        this.currentType = type;
        
        this.ui.typeButtons.forEach(btn => {
            if (btn.innerText === type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.ui.pickBtn.textContent = `Pick 5 ${type} for Me!`;
        this.populateGenres(type);
    }

    populateGenres(type) {
        this.ui.genreSelect.innerHTML = '';
        
        const defaultOption = document.createElement('option');
        defaultOption.text = `Select a ${type} Genre...`;
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        this.ui.genreSelect.appendChild(defaultOption);

        const surpriseOption = document.createElement('option');
        surpriseOption.value = "Surprise Me";
        surpriseOption.text = "🎲 Surprise Me! (Best of All Time)";
        surpriseOption.style.fontWeight = "bold";
        surpriseOption.style.color = "#4ade80";
        this.ui.genreSelect.appendChild(surpriseOption);

        const genres = GENRES_BY_TYPE[type] || [];
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.text = genre;
            this.ui.genreSelect.appendChild(option);
        });
    }

    updateHistoryCount() {
        this.ui.updateHistoryCount(this.selectionHistory.length);
    }

    clearHistory() {
        this.selectionHistory = [];
        this.updateHistoryCount();
        this.ui.showMessage("History cleared.", false);
        setTimeout(() => this.ui.hideMessage(), 2000);
    }

    saveKeyAndRetry() {
        const key = this.ui.userApiKeyInput.value.trim();
        if (key) {
            this.api.saveApiKey(key);
            this.ui.hideApiKeyInput();
            this.processSelection();
        } else {
            alert("Please enter a valid API key.");
        }
    }

    async processSelection() {
        this.ui.hideMessage();
        this.ui.hideResults();
        this.ui.hideApiKeyInput();

        let genre = this.ui.genreSelect.value;
        this.ui.setLoadingState(true, this.currentType);

        try {
            const { recommendations, sources } = await this.api.fetchRecommendations(
                this.currentType, 
                genre, 
                this.selectionHistory
            );
            
            const newTitles = this.ui.renderResult(recommendations, sources);
            this.selectionHistory.push(...newTitles);
            this.updateHistoryCount();

        } catch (error) {
            console.error(error);
            
            if (error.message === 'AUTH_ERROR') {
                this.ui.showApiKeyInput();
                this.ui.showMessage("Access Denied (401). Please enter a valid API Key above.", true);
            } else if (error.message === 'No results found') {
                this.ui.showMessage("No results found. Try a broader genre.");
            } else {
                this.ui.showMessage(`Error: ${error.message}`);
            }
        } finally {
            this.ui.setLoadingState(false, this.currentType);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
