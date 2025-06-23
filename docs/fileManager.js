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
                <button onclick="viewContent('${filePath}', '${fileName}')" 
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
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Opens content viewer modal with rendered notebook content
async function viewContent(filePath, fileName) {
    const modal = document.getElementById('fileModal');
    const modalContent = document.getElementById('modalContent');
    
    // Show loading state
    modalContent.innerHTML = `
        <h2><i class="fas fa-book-open"></i> ${formatFileName(fileName)}</h2>
        <div style="text-align: center; padding: 50px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #667eea;"></i>
            <p style="margin-top: 20px;">Loading content...</p>
        </div>
    `;
    
    try {
        // Fetch the raw notebook content
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${filePath}`);
        const notebookData = await response.json();
        
        // Render the content
        renderNotebookContent(notebookData, fileName);
        
    } catch (error) {
        console.error('Error loading content:', error);
        modalContent.innerHTML = `
            <h2><i class="fas fa-exclamation-triangle"></i> Error Loading Content</h2>
            <div style="text-align: center; padding: 50px;">
                <p style="color: #dc3545; margin-bottom: 20px;">
                    <i class="fas fa-times-circle"></i> Failed to load notebook content
                </p>
                <p style="font-size: 0.9rem; color: #666;">
                    Please try using one of the external links above.
                </p>
                <button onclick="closeModal()" 
                        style="background: #6c757d; color: white; padding: 10px 20px; 
                               border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;">
                    Close
                </button>
            </div>
        `;
    }
}

// Renders notebook content with markdown parsing
function renderNotebookContent(notebookData, fileName) {
    const modalContent = document.getElementById('modalContent');
    
    let contentHtml = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h2><i class="fas fa-book-open"></i> ${formatFileName(fileName)}</h2>
            <button onclick="closeModal()" 
                    style="background: #6c757d; color: white; padding: 8px 15px; 
                           border: none; border-radius: 5px; cursor: pointer;">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
        <div style="max-height: 70vh; overflow-y: auto; padding: 20px; background: #f8f9fa; border-radius: 10px;">
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
    
    // Initialize MathJax if available
    if (window.MathJax) {
        MathJax.typesetPromise([modalContent]).catch((err) => console.log(err));
    }
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
    
    // Links
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank" style="color: #667eea; text-decoration: none;">$1 <i class="fas fa-external-link-alt" style="font-size: 0.8rem;"></i></a>');
    
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

// Closes the file modal and restores page scroll
function closeModal() {
    const modal = document.getElementById('fileModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}