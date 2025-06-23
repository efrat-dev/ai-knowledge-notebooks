// categoryAnalyzer.js
// Handles dynamic analysis of folder contents and generates category metadata

// Analyzes folder content and generates dynamic category information
function analyzeCategoryContent(folderName, files) {
    const fileNames = files.map(f => f.name.toLowerCase());
    const topics = [];
    
    // Extract topics from filenames
    files.forEach(file => {
        const name = file.name.replace('.ipynb', '').replace(/_/g, ' ');
        topics.push(name);
    });

    // Generate dynamic title and description based on folder content
    let title = formatCategoryName(folderName);
    let description = `${files.length} notebook${files.length > 1 ? 's' : ''} covering `;
    let icon = 'fas fa-book';

    // Analyze content to determine icon and description
    if (folderName === 'root' || folderName === '') {
        title = 'Core Algorithms & Models';
        icon = 'fas fa-brain';
        description += 'fundamental machine learning algorithms and core concepts';
    } else if (folderName.includes('python') || fileNames.some(f => f.includes('python') || f.includes('oop'))) {
        icon = 'fab fa-python';
        description += 'Python programming fundamentals and advanced concepts';
    } else if (folderName.includes('math') || fileNames.some(f => f.includes('algebra') || f.includes('calculus') || f.includes('statistics'))) {
        icon = 'fas fa-square-root-alt';
        description += 'mathematical foundations for data science and ML';
    } else if (folderName.includes('ai') || folderName.includes('ml') || folderName.includes('overview')) {
        icon = 'fas fa-robot';
        description += 'artificial intelligence and machine learning overview';
    } else if (fileNames.some(f => f.includes('data') || f.includes('pandas') || f.includes('numpy'))) {
        icon = 'fas fa-chart-bar';
        description += 'data manipulation and analysis techniques';
    } else if (fileNames.some(f => f.includes('deep') || f.includes('neural') || f.includes('cnn') || f.includes('rnn'))) {
        icon = 'fas fa-network-wired';
        description += 'deep learning and neural network architectures';
    } else if (fileNames.some(f => f.includes('nlp') || f.includes('text') || f.includes('language'))) {
        icon = 'fas fa-language';
        description += 'natural language processing and text analysis';
    } else {
        // Generate description from actual file topics
        const topicSample = topics.slice(0, 3).join(', ');
        description += topicSample;
        if (topics.length > 3) {
            description += ` and ${topics.length - 3} more topics`;
        }
    }

    return { title, description, icon, topics };
}

// Formats category name for display purposes
function formatCategoryName(folderName) {
    if (folderName === 'root' || folderName === '') {
        return 'Core Topics';
    }
    
    return folderName
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}