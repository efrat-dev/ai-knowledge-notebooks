// keyboardNavigation.js
// Keyboard navigation support for modal and file operations

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('fileModal');
    if (modal && modal.style.display === 'block') {
        // Alt + Left Arrow for back
        if (event.altKey && event.key === 'ArrowLeft') {
            event.preventDefault();
            goBackInHistory();
        }
        // Alt + Right Arrow for forward
        else if (event.altKey && event.key === 'ArrowRight') {
            event.preventDefault();
            goForwardInHistory();
        }
        // Escape to close modal
        else if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
        }
    }
});

// Additional keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K to focus search (if search exists)
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="search"], .search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // F key to toggle file lists (if no modal is open)
    if (event.key === 'f' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const modal = document.getElementById('fileModal');
        if (!modal || modal.style.display !== 'block') {
            const firstCategory = document.querySelector('[onclick*="toggleFiles"]');
            if (firstCategory) {
                firstCategory.click();
            }
        }
    }
});