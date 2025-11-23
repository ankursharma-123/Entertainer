// UI Helper Functions
export class UIManager {
    constructor() {
        this.genreSelect = document.getElementById('genre-select');
        this.pickBtn = document.getElementById('pick-movie-btn');
        this.loadingContainer = document.getElementById('loading-container');
        this.resultContainer = document.getElementById('result-container');
        this.resultListContainer = document.getElementById('result-list-container');
        this.sourceListElement = document.getElementById('source-list');
        this.messageBox = document.getElementById('message-box');
        this.historyCountElement = document.getElementById('history-count');
        this.typeButtons = document.querySelectorAll('.type-btn');
        this.apiKeyContainer = document.getElementById('api-key-container');
        this.userApiKeyInput = document.getElementById('user-api-key');
    }

    showMessage(message, isError = true) {
        this.messageBox.textContent = message;
        this.messageBox.className = `mt-4 p-3 rounded-lg text-sm ${isError ? 'bg-red-900/80 text-red-100 border border-red-700' : 'bg-blue-900/80 text-blue-100 border border-blue-700'}`;
        this.messageBox.classList.remove('hidden');
    }

    hideMessage() {
        this.messageBox.classList.add('hidden');
    }

    setLoadingState(isLoading, currentType) {
        this.pickBtn.disabled = isLoading;
        this.genreSelect.disabled = isLoading;
        this.loadingContainer.classList.toggle('hidden', !isLoading);
        this.pickBtn.textContent = isLoading ? 'Searching...' : `Pick 5 ${currentType} for Me!`;
    }

    updateHistoryCount(count) {
        this.historyCountElement.textContent = `${count} titles remembered.`;
    }

    showApiKeyInput() {
        this.apiKeyContainer.classList.remove('hidden');
    }

    hideApiKeyInput() {
        this.apiKeyContainer.classList.add('hidden');
    }

    hideResults() {
        this.resultContainer.classList.add('hidden');
    }

    createPlatformBadge(platformName) {
        const name = platformName.toLowerCase();
        let bgClass = 'bg-gray-600';
        let text = platformName;
        
        // Color mapping
        if (name.includes('netflix')) { bgClass = 'bg-red-600'; text = 'N'; }
        else if (name.includes('prime') || name.includes('amazon')) { bgClass = 'bg-blue-500'; text = 'Prime'; }
        else if (name.includes('disney')) { bgClass = 'bg-blue-900'; text = 'Disney+'; }
        else if (name.includes('hulu')) { bgClass = 'bg-green-500'; text = 'Hulu'; }
        else if (name.includes('hbo') || name.includes('max')) { bgClass = 'bg-purple-600'; text = 'Max'; }
        else if (name.includes('apple')) { bgClass = 'bg-gray-500'; text = 'AppleTV'; }
        else if (name.includes('crunchyroll')) { bgClass = 'bg-orange-500'; text = 'CR'; }
        else if (name.includes('youtube')) { bgClass = 'bg-red-500'; text = 'YT'; }

        const span = document.createElement('span');
        if (text.length <= 2) {
             span.className = `${bgClass} text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded text-[10px]`;
        } else {
             span.className = `${bgClass} text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider`;
        }
        span.textContent = text;
        span.title = platformName; 
        return span;
    }

    renderResult(recommendations, sources) {
        this.resultContainer.classList.remove('hidden');
        this.resultListContainer.innerHTML = '';
        this.sourceListElement.innerHTML = '';
        
        let newTitles = [];

        recommendations.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-green-500 transition duration-150';

            // Top Row
            const topRow = document.createElement('div');
            topRow.className = 'flex justify-between items-start mb-2';

            // Left: Title
            const titleDiv = document.createElement('div');
            titleDiv.className = 'flex-1 pr-2';
            const title = document.createElement('h3');
            title.className = 'text-xl font-bold text-green-300 leading-tight';
            title.textContent = `${index + 1}. ${item.title || 'Unknown Title'}`;
            titleDiv.appendChild(title);

            // Right: Icons + Rating
            const rightSide = document.createElement('div');
            rightSide.className = 'flex items-center';

            // OTT Icons
            if (item.platforms && Array.isArray(item.platforms) && item.platforms.length > 0) {
                const ottContainer = document.createElement('div');
                ottContainer.className = 'flex items-center space-x-1 mr-3 flex-wrap justify-end gap-y-1';
                item.platforms.slice(0, 3).forEach(p => {
                    ottContainer.appendChild(this.createPlatformBadge(p));
                });
                rightSide.appendChild(ottContainer);
            }

            // Rating Group
            const ratingGroup = document.createElement('div');
            ratingGroup.className = 'flex flex-col items-end min-w-[50px]';

            const imdbLabel = document.createElement('span');
            imdbLabel.className = 'text-[10px] text-yellow-500 font-bold uppercase tracking-widest mb-0.5';
            imdbLabel.textContent = 'IMDb';

            const rating = document.createElement('span');
            rating.className = 'text-sm font-semibold px-2 py-1 bg-yellow-600 text-gray-900 rounded-md w-full text-center';
            rating.textContent = (item.imdbRating || 'N/A').replace(/\/10/g, '').trim(); 
            
            ratingGroup.appendChild(imdbLabel);
            ratingGroup.appendChild(rating);
            rightSide.appendChild(ratingGroup);

            topRow.appendChild(titleDiv);
            topRow.appendChild(rightSide);

            const suggestion = document.createElement('p');
            suggestion.className = 'text-gray-400 text-sm mt-1';
            suggestion.textContent = item.suggestion || 'No description provided.';
            
            card.appendChild(topRow);
            card.appendChild(suggestion);
            this.resultListContainer.appendChild(card);
            
            if (item.title) newTitles.push(item.title);
        });
        
        // Sources
        if (sources && sources.length > 0) {
            const uniqueSources = Array.from(new Map(sources.map(item => [item['uri'], item])).values());
            const sourceHeader = document.createElement('div');
            sourceHeader.textContent = 'Sources:';
            this.sourceListElement.appendChild(sourceHeader);

            uniqueSources.slice(0, 3).forEach((source, index) => {
                if (source.uri && source.title) {
                    const link = document.createElement('a');
                    link.href = source.uri;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.className = 'text-blue-400 hover:underline block truncate';
                    link.textContent = `${index + 1}. ${source.title}`;
                    this.sourceListElement.appendChild(link);
                }
            });
        }

        return newTitles;
    }
}
