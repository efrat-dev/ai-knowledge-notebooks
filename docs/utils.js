// utils.js
// Utility functions for data processing and formatting

// Update status indicator
function updateStatus(status, text) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    indicator.className = `status-indicator status-${status}`;
    statusText.textContent = text;
}

// Format filename for display
function formatFileName(filename) {
    return filename
        .replace('.ipynb', '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Load live data from GitHub
async function loadLiveData() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
        const response = await fetch(GITHUB_TREE_URL, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.tree) {
            throw new Error('Invalid response structure');
        }

        // Process the tree data
        repositoryData = {};
        allFiles = [];

        data.tree.forEach(item => {
            if (item.path.endsWith('.ipynb')) {
                const parts = item.path.split('/');
                let category = 'root';
                
                if (parts.length > 1) {
                    category = parts[0];
                }

                if (!repositoryData[category]) {
                    repositoryData[category] = [];
                }

                const file = {
                    name: parts[parts.length - 1],
                    path: item.path,
                    size: item.size
                };

                repositoryData[category].push(file);
                allFiles.push(file);
            }
        });

        // Update stats
        document.getElementById('totalFiles').textContent = allFiles.length;
        document.getElementById('totalFolders').textContent = Object.keys(repositoryData).length;
        document.getElementById('lastUpdate').textContent = 'Latest';

    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Create floating particles animation
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        particlesContainer.appendChild(particle);
    }
}