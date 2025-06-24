// fileManager.js
// Handles file operations, modal displays, and file list interactions
// Enhanced with history navigation system

// History management for modal navigation
let modalHistory = [];
let currentHistoryIndex = -1;

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

// Adds a state to modal history
function addToModalHistory(state) {
    // Remove any future history if we're in the middle of history
    if (currentHistoryIndex < modalHistory.length - 1) {
        modalHistory = modalHistory.slice(0, currentHistoryIndex + 1);
    }
    
    modalHistory.push(state);
    currentHistoryIndex = modalHistory.length - 1;
    
    // Update navigation UI
    updateHistoryNavigation();
}

// Updates the history navigation buttons
function updateHistoryNavigation() {
    const backBtn = document.getElementById('historyBackBtn');
    const forwardBtn = document.getElementById('historyForwardBtn');
    const historyPosition = document.getElementById('historyPosition');
    
    if (backBtn) {
        backBtn.disabled = currentHistoryIndex <= 0;
        backBtn.style.opacity = currentHistoryIndex <= 0 ? '0.5' : '1';
    }
    
    if (forwardBtn) {
        forwardBtn.disabled = currentHistoryIndex >= modalHistory.length - 1;
        forwardBtn.style.opacity = currentHistoryIndex >= modalHistory.length - 1 ? '0.5' : '1';
    }
    
    if (historyPosition) {
        historyPosition.textContent = `${currentHistoryIndex + 1} / ${modalHistory.length}`;
    }
}

// Navigates back in history
function goBackInHistory() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        const previousState = modalHistory[currentHistoryIndex];
        restoreModalState(previousState);
    }
}

// Navigates forward in history
function goForwardInHistory() {
    if (currentHistoryIndex < modalHistory.length - 1) {
        currentHistoryIndex++;
        const nextState = modalHistory[currentHistoryIndex];
        restoreModalState(nextState);
    }
}

// Restores a modal state from history
function restoreModalState(state) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = state.content;
    
    // Restore any event listeners or special handling
    if (state.type === 'notebook_content') {
        restoreNotebookContentHandlers();
    }
    
    updateHistoryNavigation();
}

// Restores event handlers for notebook content
function restoreNotebookContentHandlers() {
    const notebookContentDiv = document.getElementById('notebookContent');
    if (notebookContentDiv) {
        const links = notebookContentDiv.querySelectorAll('a');
        links.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        // Initialize MathJax if available
        if (window.MathJax) {
            MathJax.typesetPromise([document.getElementById('modalContent')]).catch((err) => console.log(err));
        }
    }
}

// Creates the history navigation bar HTML
function createHistoryNavigationBar() {
    return `
        <div id="historyNavBar" style="
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 10px 0; 
            border-bottom: 1px solid #e0e0e0; 
            margin-bottom: 20px;
        ">
            <div style="display: flex; gap: 10px;">
                <button id="historyBackBtn" onclick="goBackInHistory()" style="
                    background: #6c757d; 
                    color: white; 
                    border: none; 
                    padding: 8px 12px; 
                    border-radius: 5px; 
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                " disabled>
                    <i class="fas fa-arrow-left"></i>
                    <span>אחורה</span>
                </button>
                <button id="historyForwardBtn" onclick="goForwardInHistory()" style="
                    background: #6c757d; 
                    color: white; 
                    border: none; 
                    padding: 8px 12px; 
                    border-radius: 5px; 
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                " disabled>
                    <span>קדימה</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
            <div style="color: #6c757d; font-size: 0.9rem;">
                <span id="historyPosition">1 / 1</span>
            </div>
            <button onclick="closeModal()" style="
                background: #dc3545; 
                color: white; 
                border: none; 
                padding: 8px 12px; 
                border-radius: 5px; 
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
            ">
                <i class="fas fa-times"></i>
                <span>סגור</span>
            </button>
        </div>
    `;
}

// Opens file modal with access links and information
function openFile(filePath, fileName) {
    const modal = document.getElementById('fileModal');
    const modalContent = document.getElementById('modalContent');
    
    // Clear history when opening new modal session
    modalHistory = [];
    currentHistoryIndex = -1;
    
    const content = `
        ${createHistoryNavigationBar()}
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
                <button onclick="viewContentWithContext('${filePath}', '${fileName}')" 
                        style="display: inline-block; background: #6f42c1; color: white; padding: 12px 20px; 
                               border-radius: 8px; border: none; cursor: pointer; font-weight: 500;">
                    <i class="fas fa-book-open"></i> View Content
                </button>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="font-size: 0.9rem; color: #666; text-align: center;">
                    <i class="fas fa-info-circle"></i> 
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

// Opens content viewer modal with rendered notebook content
async function viewContent(filePath, fileName) {
    const modal = document.getElementById('fileModal');
    const modalContent = document.getElementById('modalContent');
    
    // Show loading state
    const loadingContent = `
        ${createHistoryNavigationBar()}
        <h2><i class="fas fa-book-open"></i> ${formatFileName(fileName)}</h2>
        <div style="text-align: center; padding: 50px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #667eea;"></i>
            <p style="margin-top: 20px;">Loading content...</p>
        </div>
    `;
    
    modalContent.innerHTML = loadingContent;
    
    try {
        // Fix the file path - remove /docs/ prefix if it exists and ensure correct path
        let correctedPath = filePath;
        
        // Remove /docs/ prefix if exists
        if (correctedPath.startsWith('docs/')) {
            correctedPath = correctedPath.substring(5);
        }
        
        // If path doesn't include directory structure, try to reconstruct it
        if (!correctedPath.includes('/') && fileName) {
            // Try to guess the correct path based on common patterns
            const possiblePaths = [
                `AI ML DATA SCIENCE OVERVIEW/${fileName}`,
                `DATA SCIENCE/${fileName}`,
                `MACHINE LEARNING/${fileName}`,
                `ARTIFICIAL INTELLIGENCE/${fileName}`,
                fileName // fallback to root
            ];
            
            // Try each possible path
            for (const testPath of possiblePaths) {
                try {
                    const testResponse = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${testPath}`);
                    if (testResponse.ok) {
                        correctedPath = testPath;
                        break;
                    }
                } catch (e) {
                    continue; // Try next path
                }
            }
        }
        
        console.log('Trying to fetch:', correctedPath);
        
        // Fetch the raw notebook content
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${correctedPath}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const notebookData = await response.json();
        
        // Render the content
        renderNotebookContent(notebookData, fileName);
        
    } catch (error) {
        console.error('Error loading content:', error);
        const errorContent = `
            ${createHistoryNavigationBar()}
            <h2><i class="fas fa-exclamation-triangle"></i> Error Loading Content</h2>
            <div style="text-align: center; padding: 50px;">
                <p style="color: #dc3545; margin-bottom: 20px;">
                    <i class="fas fa-times-circle"></i> Failed to load notebook content
                </p>
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 15px;">
                    Path attempted: <code>${filePath}</code>
                </p>
                <p style="font-size: 0.9rem; color: #666;">
                    Please try using one of the external links above or check the file path.
                </p>
            </div>
        `;
        
        modalContent.innerHTML = errorContent;
        
        // Add error state to history
        addToModalHistory({
            type: 'error',
            content: errorContent,
            filePath: filePath,
            fileName: fileName
        });
    }
}

// Renders notebook content with markdown parsing
function renderNotebookContent(notebookData, fileName) {
    const modalContent = document.getElementById('modalContent');
    
    let contentHtml = `
        ${createHistoryNavigationBar()}
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h2><i class="fas fa-book-open"></i> ${formatFileName(fileName)}</h2>
        </div>
        <div id="notebookContent" style="max-height: 60vh; overflow-y: auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
    `;
    
    // Process each cell in the notebook
    notebookData.cells.forEach((cell, index) => {
        if (cell.cell_type === 'markdown') {
            const markdownContent = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
            contentHtml += `
                <div style="margin-bottom: 25px; background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                    ${parseMarkdown(markdownContent)}
                </div>
            `;
        } else if (cell.cell_type === 'code') {
            const codeContent = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
            contentHtml += `
                <div style="margin-bottom: 25px;">
                    <div style="background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 8px 8px 0 0; font-family: 'Courier New', monospace;">
                        <div style="color: #4fd1c7; font-size: 0.9rem; margin-bottom: 10px;">
                            <i class="fas fa-code"></i> Code Cell [${index + 1}]
                        </div>
                        <pre style="margin: 0; white-space: pre-wrap; font-size: 0.9rem;">${escapeHtml(codeContent)}</pre>
                    </div>
            `;
            
            // Add output if available
            if (cell.outputs && cell.outputs.length > 0) {
                contentHtml += `
                    <div style="background: #f1f5f9; padding: 15px; border-radius: 0 0 8px 8px; border-top: 1px solid #cbd5e0;">
                        <div style="color: #4a5568; font-size: 0.9rem; margin-bottom: 10px;">
                            <i class="fas fa-terminal"></i> Output:
                        </div>
                        ${renderCellOutputs(cell.outputs)}
                    </div>
                `;
            } else {
                contentHtml += `</div>`;
            }
            
            contentHtml += `</div>`;
        }
    });
    
    contentHtml += `</div>`;
    modalContent.innerHTML = contentHtml;
    
    // Add notebook content state to history
    addToModalHistory({
        type: 'notebook_content',
        content: contentHtml,
        fileName: fileName
    });
    
    // Fix all links to open in new tab and prevent modal interference
    restoreNotebookContentHandlers();
}

// Enhanced markdown parser with support for math, icons, and formatting
function parseMarkdown(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 style="color: #2d3748; margin: 20px 0 15px 0; font-size: 1.3rem;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="color: #2d3748; margin: 25px 0 20px 0; font-size: 1.5rem;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="color: #2d3748; margin: 30px 0 25px 0; font-size: 1.8rem;">$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: monospace;"><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]*)`/gim, '<code style="background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-family: monospace;">$1</code>');
    
    // Math expressions (LaTeX)
    html = html.replace(/\$\$([\s\S]*?)\$\$/gim, '<div style="text-align: center; margin: 20px 0;">$$$$1$$</div>');
    html = html.replace(/\$([^$]*)\$/gim, '\\($1\\)');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li style="margin: 5px 0;">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li style="margin: 5px 0;">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li style="margin: 5px 0;">$1</li>');
    
    // Wrap consecutive list items
    html = html.replace(/(<li[^>]*>.*<\/li>\s*)+/gim, '<ul style="margin: 15px 0; padding-left: 30px;">$&</ul>');
    
    // Links - handle internal notebook links and external links differently
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, (match, linkText, linkUrl) => {
        // Check if it's an internal notebook link (ends with .ipynb)
        if (linkUrl.endsWith('.ipynb')) {
            // Extract filename from path (remove ./ prefix if exists)
            let fileName = linkUrl.replace(/^\.\//, '');
            // For internal links, we need to construct the full path based on current location
            // This will be handled by intercepting the click
            return `<a href="#" onclick="handleInternalNotebookLink('${linkUrl}', '${linkText}'); return false;" style="color: #667eea; text-decoration: none; cursor: pointer;">${linkText} <i class="fas fa-book" style="font-size: 0.8rem;"></i></a>`;
        } else {
            // External link - open in new tab
            return `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" style="color: #667eea; text-decoration: none;">${linkText} <i class="fas fa-external-link-alt" style="font-size: 0.8rem;"></i></a>`;
        }
    });
    
    // Font Awesome icons (e.g., :fa-icon-name:)
    html = html.replace(/:fa-([\w-]+):/gim, '<i class="fas fa-$1"></i>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #667eea; margin: 15px 0; padding-left: 20px; font-style: italic; color: #555;">$1</blockquote>');
    
    // Line breaks
    html = html.replace(/\n/gim, '<br>');
    
    // Clean up extra breaks
    html = html.replace(/(<br>\s*){3,}/gim, '<br><br>');
    
    return html;
}

// Renders cell outputs (for code cells)
function renderCellOutputs(outputs) {
    let outputHtml = '';
    
    outputs.forEach(output => {
        if (output.output_type === 'stream') {
            const text = Array.isArray(output.text) ? output.text.join('') : output.text;
            outputHtml += `<pre style="margin: 5px 0; font-family: monospace; color: #2d3748;">${escapeHtml(text)}</pre>`;
        } else if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
            if (output.data) {
                if (output.data['text/plain']) {
                    const text = Array.isArray(output.data['text/plain']) ? output.data['text/plain'].join('') : output.data['text/plain'];
                    outputHtml += `<pre style="margin: 5px 0; font-family: monospace; color: #2d3748;">${escapeHtml(text)}</pre>`;
                }
                if (output.data['text/html']) {
                    const html = Array.isArray(output.data['text/html']) ? output.data['text/html'].join('') : output.data['text/html'];
                    outputHtml += `<div style="margin: 10px 0;">${html}</div>`;
                }
                if (output.data['image/png']) {
                    outputHtml += `<img src="data:image/png;base64,${output.data['image/png']}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="Output image">`;
                }
            }
        } else if (output.output_type === 'error') {
            outputHtml += `<pre style="margin: 5px 0; color: #dc3545; font-family: monospace; background: #f8d7da; padding: 10px; border-radius: 5px;">${escapeHtml(output.traceback ? output.traceback.join('\n') : output.evalue || 'Error occurred')}</pre>`;
        }
    });
    
    return outputHtml || '<p style="color: #6c757d; font-style: italic;">No output</p>';
}

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Handles internal notebook links - opens the file selection modal
function handleInternalNotebookLink(relativePath, linkText) {
    // Extract filename from relative path
    let fileName = relativePath.replace(/^\.\//, '');
    
    // Get the current directory context from the last opened file
    // This assumes we have access to the current directory structure
    let currentDir = getCurrentDirectory();
    let fullPath = currentDir ? `${currentDir}/${fileName}` : fileName;
    
    // Open the file modal for the linked notebook (this will add to history)
    viewContentWithContext(fullPath, fileName);
}

// Helper function to determine current directory context
function getCurrentDirectory() {
    // This could be enhanced to track the current directory context
    // For now, we'll try to guess based on common patterns
    
    // You can customize this based on your actual directory structure
    const commonDirs = [
        'AI ML DATA SCIENCE OVERVIEW',
        'DATA SCIENCE', 
        'MACHINE LEARNING',
        'ARTIFICIAL INTELLIGENCE'
    ];
    
    // Return the most likely directory - this could be enhanced
    // to actually track the current context
    return 'AI ML DATA SCIENCE OVERVIEW'; // Default assumption
}

// Enhanced version that can track directory context
let currentNotebookContext = null;

// Update viewContent to track current directory
async function viewContentWithContext(filePath, fileName, contextDir = null) {
    // Set current context
    if (contextDir) {
        currentNotebookContext = contextDir;
    } else {
        // Try to extract directory from filePath
        const pathParts = filePath.split('/');
        if (pathParts.length > 1) {
            currentNotebookContext = pathParts.slice(0, -1).join('/');
        }
    }
    
    // Call the original viewContent function
    return viewContent(filePath, fileName);
}

// Enhanced handleInternalNotebookLink that uses context
function handleInternalNotebookLink(relativePath, linkText) {
    let fileName = relativePath.replace(/^\.\//, '');
    
    // Use current context if available
    let fullPath = fileName;
    if (currentNotebookContext) {
        fullPath = `${currentNotebookContext}/${fileName}`;
    }
    
    // Open the file modal for the linked notebook
    viewContentWithContext(fullPath, fileName);
}

// Closes the file modal and restores page scroll
function closeModal() {
    const modal = document.getElementById('fileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Clear history when closing modal
    modalHistory = [];
    currentHistoryIndex = -1;
}

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