// markdownParser.js
// Enhanced markdown parser with support for math, icons, and formatting

// Enhanced markdown parser with support for math, icons, and formatting
function parseMarkdown(markdown) {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/gim, '<pre class="md-code-block"><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]*)`/gim, '<code class="md-inline-code">$1</code>');
    
    // Math expressions (LaTeX)
    html = html.replace(/\$\$([\s\S]*?)\$\$/gim, '<div class="md-math-block">$$$$1$$</div>');
    html = html.replace(/\$([^$]*)\$/gim, '\\($1\\)');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li class="md-list-item">$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="md-list-item">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="md-list-item">$1</li>');
    
    // Wrap consecutive list items
    html = html.replace(/(<li[^>]*>.*<\/li>\s*)+/gim, '<ul class="md-list">$&</ul>');
    
    // Links - handle internal notebook links and external links differently
    html = html.replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, (match, linkText, linkUrl) => {
        // Check if it's an internal notebook link (ends with .ipynb)
        if (linkUrl.endsWith('.ipynb')) {
            // Extract filename from path (remove ./ prefix if exists)
            let fileName = linkUrl.replace(/^\.\//, '');
            // For internal links, we need to construct the full path based on current location
            // This will be handled by intercepting the click
            return `<a href="#" onclick="handleInternalNotebookLink('${linkUrl}', '${linkText}'); return false;" class="md-link internal-link">${linkText} <i class="fas fa-book"></i></a>`;
        } else {
            // External link - open in new tab
            return `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="md-link external-link">${linkText} <i class="fas fa-external-link-alt"></i></a>`;
        }
    });
    
    // Font Awesome icons (e.g., :fa-icon-name:)
    html = html.replace(/:fa-([\w-]+):/gim, '<i class="fas fa-$1"></i>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="md-blockquote">$1</blockquote>');
    
    // Line breaks
    html = html.replace(/\n/gim, '<br>');
    
    // Clean up extra breaks
    html = html.replace(/(<br>\s*){3,}/gim, '<br><br>');
    
    return html;
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