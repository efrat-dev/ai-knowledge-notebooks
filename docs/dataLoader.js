// dataLoader.js
// Handles loading data from GitHub API and processing repository structure

// Loads live data from GitHub repository API
async function loadLiveData() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

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

        // Update statistics display
        document.getElementById('totalFiles').textContent = allFiles.length;
        document.getElementById('totalFolders').textContent = Object.keys(repositoryData).length;
        document.getElementById('lastUpdate').textContent = 'Current';

    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}