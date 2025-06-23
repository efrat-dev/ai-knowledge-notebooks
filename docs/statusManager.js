// statusManager.js
// Manages application status indicators and user feedback

// Updates the status indicator with current application state
function updateStatus(status, text) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    indicator.className = `status-indicator status-${status}`;
    statusText.textContent = text;
}