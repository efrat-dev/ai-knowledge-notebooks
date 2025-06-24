// modalHistory.js
// Modal history navigation system

// History management for modal navigation
let modalHistory = [];
let currentHistoryIndex = -1;

// Adds a state to modal history
function addToModalHistory(state) {
    // Remove any future history if we're in the middle of history
    if (currentHistoryIndex < modalHistory.length - 1) {
        modalHistory = modalHistory.slice(0, currentHistoryIndex + 1);
    }
    
    modalHistory.push(state);
    currentHistoryIndex = modalHistory.length - 1;
    
    // Update navigation UI
    updateHistoryNavigation();
}

// Updates the history navigation buttons
function updateHistoryNavigation() {
    const backBtn = document.getElementById('historyBackBtn');
    const forwardBtn = document.getElementById('historyForwardBtn');
    const historyPosition = document.getElementById('historyPosition');
    
    if (backBtn) {
        backBtn.disabled = currentHistoryIndex <= 0;
        backBtn.style.opacity = currentHistoryIndex <= 0 ? '0.5' : '1';
    }
    
    if (forwardBtn) {
        forwardBtn.disabled = currentHistoryIndex >= modalHistory.length - 1;
        forwardBtn.style.opacity = currentHistoryIndex >= modalHistory.length - 1 ? '0.5' : '1';
    }
    
    if (historyPosition) {
        historyPosition.textContent = `${currentHistoryIndex + 1} / ${modalHistory.length}`;
    }
}

// Navigates back in history
function goBackInHistory() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        const previousState = modalHistory[currentHistoryIndex];
        restoreModalState(previousState);
    }
}

// Navigates forward in history
function goForwardInHistory() {
    if (currentHistoryIndex < modalHistory.length - 1) {
        currentHistoryIndex++;
        const nextState = modalHistory[currentHistoryIndex];
        restoreModalState(nextState);
    }
}

// Restores a modal state from history
function restoreModalState(state) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = state.content;
    
    // Restore any event listeners or special handling
    if (state.type === 'notebook_content') {
        restoreNotebookContentHandlers();
    }
    
    updateHistoryNavigation();
}

// Clears modal history
function clearModalHistory() {
    modalHistory = [];
    currentHistoryIndex = -1;
}

// Creates the history navigation bar HTML
function createHistoryNavigationBar() {
    return `
        <div id="historyNavBar" class="history-nav-bar">
            <div class="history-nav-buttons">
                <button id="historyBackBtn" onclick="goBackInHistory()" class="nav-button back-btn" disabled>
                    <i class="fas fa-arrow-left"></i>
                    <span>אחורה</span>
                </button>
                <button id="historyForwardBtn" onclick="goForwardInHistory()" class="nav-button forward-btn" disabled>
                    <span>קדימה</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            <div class="history-position">
                <span id="historyPosition">1 / 1</span>
            </div>
            <button onclick="closeModal()" class="nav-button close-btn">
                <i class="fas fa-times"></i>
                <span>סגור</span>
            </button>
        </div>
    `;
}