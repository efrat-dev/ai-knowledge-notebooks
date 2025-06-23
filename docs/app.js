// app.js
// Main application logic and initialization

// Initialize the application
async function initializeApp() {
    updateStatus('loading', 'Loading data...');
    
    try {
        // Try to load live data first
        await loadLiveData();
        updateStatus('live', 'Live data');
        isLiveData = true;
        document.getElementById('dataSource').textContent = 'Live';
    } catch (error) {
        console.warn('Live data unavailable, using cache:', error);
        // If no internet or API unavailable, show error state
        updateStatus('error', 'Unavailable');
        document.getElementById('loadingMessage').innerHTML = `
            <i class="fas fa-wifi" style="color: #ffc107;"></i>
            <p>Data is currently unavailable</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">Internet connection is required to view files</p>
        `;
        return;
    }

    renderCategories();
    setupSearch();
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('statsContainer').style.display = 'grid';
    createParticles();
}

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

    // Add interactive effects
    addInteractiveEffects();
});