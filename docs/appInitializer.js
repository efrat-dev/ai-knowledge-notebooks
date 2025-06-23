// appInitializer.js
// Main application initialization and startup logic

// Initializes the entire application
async function initializeApp() {
    updateStatus('loading', 'Loading data...');
    
    try {
        // Try to load live data first
        await loadLiveData();
        updateStatus('live', 'Current data');
        isLiveData = true;
        document.getElementById('dataSource').textContent = 'Live';
    } catch (error) {
        console.warn('Live data unavailable, using cache:', error);
        updateStatus('error', 'Not available');
        document.getElementById('loadingMessage').innerHTML = `
            <i class="fas fa-wifi" style="color: #ffc107;"></i>
            <p>Data is currently unavailable</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">Internet connection required to view files</p>
        `;
        return;
    }

    renderCategories();
    setupSearch();
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('statsContainer').style.display = 'grid';
    createParticles();
}