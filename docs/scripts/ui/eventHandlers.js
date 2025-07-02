// eventHandlers.js
// Event listeners and DOM interaction handlers

// Sets up all event listeners when DOM is loaded
function setupEventListeners() {
    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('fileModal');
            if (event.target === modal) {
                closeModal();
            }
        });
    });

    // Add interactive effects after initialization
    document.addEventListener('DOMContentLoaded', function() {
        addInteractiveEffects();
    });
}

// Initialize event handlers
setupEventListeners();