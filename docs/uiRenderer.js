// uiRenderer.js
// Handles rendering of UI components and dynamic content generation

// Renders category cards dynamically based on repository data
function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    container.innerHTML = '';

    if (Object.keys(repositoryData).length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: white; padding: 40px;">
                <i class="fas fa-cloud-download-alt" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.7;"></i>
                <h3>No data available</h3>
                <p>Internet connection required to view content</p>
            </div>
        `;
        return;
    }

    Object.entries(repositoryData).forEach(([folderName, files], index) => {
        const categoryInfo = analyzeCategoryContent(folderName, files);
        
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.style.animationDelay = `${index * 0.1}s`;
        categoryCard.onclick = () => toggleFiles(folderName);

        categoryCard.innerHTML = `
            <div class="category-icon">
                <i class="${categoryInfo.icon}"></i>
            </div>
            <div class="category-title">${categoryInfo.title}</div>
            <div class="category-stats">
                <span><i class="fas fa-file-code"></i> ${files.length} files</span>
                <span><i class="fas fa-folder"></i> ${folderName === 'root' ? 'Root' : folderName}</span>
            </div>
            <div class="category-description">${categoryInfo.description}</div>
            <div class="files-list" id="${folderName}-files">
                ${files.map(file => `
                    <div class="file-item" onclick="openFile('${file.path}', '${file.name}')">
                        <div class="file-name">
                            <i class="fas fa-file-code file-icon"></i>
                            ${formatFileName(file.name)}
                        </div>
                        <div class="file-date">Jupyter Notebook</div>
                    </div>
                `).join('')}
            </div>
        `;

        container.appendChild(categoryCard);
    });
}

// Formats filename for better display readability
function formatFileName(filename) {
    return filename
        .replace('.ipynb', '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}