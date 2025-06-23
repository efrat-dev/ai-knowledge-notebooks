// ui.js
// User interface functions for rendering and interactions

// Render categories
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
        const config = categoryConfig[folderName] || categoryConfig['root'];
        
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.style.animationDelay = `${index * 0.1}s`;
        categoryCard.onclick = () => toggleFiles(folderName);

        categoryCard.innerHTML = `
            <div class="category-icon">
                <i class="${config.icon}"></i>
            </div>
            <div class="category-title">${config.title}</div>
            <div class="category-description">${config.description}</div>
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

// Toggle files visibility
function toggleFiles(category) {
    const filesList = document.getElementById(category + '-files');
    const isVisible = filesList.style.display === 'block';
    
    // Hide all other file lists
    document.querySelectorAll('.files-list').forEach(list => {
        list.style.display = 'none';
    });
    
    // Toggle current list
    if (!isVisible) {
        filesList.style.display = 'block';
        filesList.style.animation = 'fadeInUp 0.5s ease-out';
    }
}

// Open file modal
function openFile(filePath, fileName) {
    const modal = document.getElementById('fileModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2><i class="fas fa-file-code"></i> ${formatFileName(fileName)}</h2>
        <div style="text-align: center; margin: 30px 0;">
            <p style="margin-bottom: 20px;">Access this Jupyter Notebook:</p>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
            <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
                <a href="https://github.com/${GITHUB_USER}/${GITHUB_REPO}/blob/main/${filePath}" 
                   target="_blank" 
                   style="display: inline-block; background: #667eea; color: white; padding: 12px 20px; 
                          border-radius: 8px; text-decoration: none; font-weight: 500;">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
                <a href="https://nbviewer.org/github/${GITHUB_USER}/${GITHUB_REPO}/blob/main/${filePath}" 
                   target="_blank" 
                   style="display: inline-block; background: #28a745; color: white; padding: 12px 20px; 
                          border-radius: 8px; text-decoration: none; font-weight: 500;">
                    <i class="fas fa-eye"></i> NBViewer
                </a>
                <a href="https://colab.research.google.com/github/${GITHUB_USER}/${GITHUB_REPO}/blob/main/${filePath}" 
                   target="_blank" 
                   style="display: inline-block; background: #ff9800; color: white; padding: 12px 20px; 
                          border-radius: 8px; text-decoration: none; font-weight: 500;">
                    <i class="fab fa-google"></i> Open in Colab
                </a>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="font-size: 0.9rem; color: #666; text-align: center;">
                    <i class="fas fa-info-circle"></i> 
                    Jupyter Notebook with detailed explanations, code examples, and exercises
                </p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('fileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Setup search functionality
function setupSearch() {
    const searchBox = document.getElementById('searchBox');
    
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const allFileItems = document.querySelectorAll('.file-item');
        
        allFileItems.forEach(item => {
            const fileName = item.querySelector('.file-name').textContent.toLowerCase();
            const isVisible = fileName.includes(searchTerm);
            
            item.style.display = isVisible ? 'flex' : 'none';
            
            if (isVisible && searchTerm) {
                item.closest('.files-list').style.display = 'block';
            }
        });
        
        // If search is empty, hide all file lists
        if (!searchTerm) {
            document.querySelectorAll('.files-list').forEach(list => {
                list.style.display = 'none';
            });
        }
    });
}

// Add interactive hover effects to category cards
function addInteractiveEffects() {
    // Add hover effects to category cards
    setTimeout(() => {
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }, 2000);
}