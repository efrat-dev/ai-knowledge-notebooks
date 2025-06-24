// notebookViewer.js
// Handles notebook content loading and rendering

// Current notebook context tracking
let currentNotebookContext = null;

// Opens content viewer modal with rendered notebook content
async function viewContent(filePath, fileName) {
    const modal = document.getElementById('fileModal');
    const modalContent = document.getElementById('modalContent');
    
    // Show loading state
    const loadingContent = `
        ${createHistoryNavigationBar()}
        <h2><i class="fas fa-book-open"></i> ${formatFileName(fileName)}</h2>
        <div class="loading-container">
            <i class="fas fa-spinner fa-spin loading-spinner"></i>
            <p>Loading content...</p>
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
            <div class="error-container">
                <p class="error-message">
                    <i class="fas fa-times-circle"></i> Failed to load notebook content
                </p>
                <p class="error-details">
                    Path attempted: <code>${filePath}</code>
                </p>
                <p class="error-suggestion">
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

// Enhanced version that can track directory context
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

// Renders notebook content with markdown parsing
function renderNotebookContent(notebookData, fileName) {
    const modalContent = document.getElementById('modalContent');
    
    let contentHtml = `
        ${createHistoryNavigationBar()}
        <div class="notebook-header">
            <h2><i class="fas fa-book-open"></i> ${formatFileName(fileName)}</h2>
        </div>
        <div id="notebookContent" class="notebook-content">
    `;
    
    // Process each cell in the notebook
    notebookData.cells.forEach((cell, index) => {
        if (cell.cell_type === 'markdown') {
            const markdownContent = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
            contentHtml += `
                <div class="markdown-cell">
                    ${parseMarkdown(markdownContent)}
                </div>
            `;
        } else if (cell.cell_type === 'code') {
            const codeContent = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
            contentHtml += `
                <div class="code-cell">
                    <div class="code-header">
                        <div class="code-label">
                            <i class="fas fa-code"></i> Code Cell [${index + 1}]
                        </div>
                        <pre class="code-content">${escapeHtml(codeContent)}</pre>
                    </div>
            `;
            
            // Add output if available
            if (cell.outputs && cell.outputs.length > 0) {
                contentHtml += `
                    <div class="code-output">
                        <div class="output-label">
                            <i class="fas fa-terminal"></i> Output:
                        </div>
                        ${renderCellOutputs(cell.outputs)}
                    </div>
                `;
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

// Renders cell outputs (for code cells)
function renderCellOutputs(outputs) {
    let outputHtml = '';
    
    outputs.forEach(output => {
        if (output.output_type === 'stream') {
            const text = Array.isArray(output.text) ? output.text.join('') : output.text;
            outputHtml += `<pre class="output-stream">${escapeHtml(text)}</pre>`;
        } else if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
            if (output.data) {
                if (output.data['text/plain']) {
                    const text = Array.isArray(output.data['text/plain']) ? output.data['text/plain'].join('') : output.data['text/plain'];
                    outputHtml += `<pre class="output-text">${escapeHtml(text)}</pre>`;
                }
                if (output.data['text/html']) {
                    const html = Array.isArray(output.data['text/html']) ? output.data['text/html'].join('') : output.data['text/html'];
                    outputHtml += `<div class="output-html">${html}</div>`;
                }
                if (output.data['image/png']) {
                    outputHtml += `<img src="data:image/png;base64,${output.data['image/png']}" class="output-image" alt="Output image">`;
                }
            }
        } else if (output.output_type === 'error') {
            outputHtml += `<pre class="output-error">${escapeHtml(output.traceback ? output.traceback.join('\n') : output.evalue || 'Error occurred')}</pre>`;
        }
    });
    
    return outputHtml || '<p class="no-output">No output</p>';
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