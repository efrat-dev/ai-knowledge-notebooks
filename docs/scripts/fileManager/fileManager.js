// fileManager.js
// Core file operations and modal management

// Toggles visibility of files list for a specific category
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

// Opens file modal with access links and information
function openFile(filePath, fileName) {
    const modal = document.getElementById('fileModal');
    const modalContent = document.getElementById('modalContent');
    
    // Clear history when opening new modal session
    clearModalHistory();
    
    const content = `
        ${createHistoryNavigationBar()}
        <h2><i class="fas fa-file-code"></i> ${formatFileName(fileName)}</h2>
        <div style="text-align: center; margin: 30px 0;">
            <p style="margin-bottom: 20px;">Access this Jupyter Notebook:</p>
        </div>
        <div class="file-access-panel">
            <div class="access-buttons-container">
                <a href="https://github.com/${GITHUB_USER}/${GITHUB_REPO}/blob/main/${filePath}" 
                   target="_blank" 
                   class="access-button github-btn">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
                <a href="https://nbviewer.org/github/${GITHUB_USER}/${GITHUB_REPO}/blob/main/${filePath}" 
                   target="_blank" 
                   class="access-button nbviewer-btn">
                    <i class="fas fa-eye"></i> NBViewer
                </a>
                <a href="https://colab.research.google.com/github/${GITHUB_USER}/${GITHUB_REPO}/blob/main/${filePath}" 
                   target="_blank" 
                   class="access-button colab-btn">
                    <i class="fab fa-google"></i> Open in Colab
                </a>
                <button onclick="viewContentWithContext('${filePath}', '${fileName}')" 
                        class="access-button content-btn">
                    <i class="fas fa-book-open"></i> View Content
                </button>
            </div>
            <div class="access-info">
                <p><i class="fas fa-info-circle"></i> 
                   Jupyter Notebook with detailed explanations, code examples, and exercises
                </p>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = content;
    
    // Add initial state to history
    addToModalHistory({
        type: 'file_info',
        content: content,
        filePath: filePath,
        fileName: fileName
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Closes the file modal and restores page scroll
function closeModal() {
    const modal = document.getElementById('fileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Clear history when closing modal
    clearModalHistory();
}

// Helper function to format file names
function formatFileName(fileName) {
    return fileName.replace(/\.ipynb$/, '').replace(/_/g, ' ');
}