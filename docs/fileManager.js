// fileManager.js
// Handles file operations, modal displays, and file list interactions

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

// Closes the file modal and restores page scroll
function closeModal() {
    const modal = document.getElementById('fileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}