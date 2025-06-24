// searchHandler.js
// Implements search functionality for filtering files and notebooks

// Sets up search functionality with real-time filtering
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