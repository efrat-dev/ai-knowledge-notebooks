// config.js
// Configuration file for GitHub repository and categories

// GitHub configuration
const GITHUB_USER = 'efrat-dev';
const GITHUB_REPO = 'ai-knowledge-notebooks';
const GITHUB_TREE_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/git/trees/main?recursive=1`;

// Category mapping with icons and descriptions
const categoryConfig = {
    'ai-ml-ds-overview': {
        icon: 'fas fa-robot',
        title: 'AI, ML & Data Science Overview',
        description: 'Comprehensive introduction to AI, Machine Learning, and Data Science fundamentals'
    },
    'python_language': {
        icon: 'fab fa-python',
        title: 'Python Programming',
        description: 'Python fundamentals and object-oriented programming concepts'
    },
    'math': {
        icon: 'fas fa-square-root-alt',
        title: 'Mathematical Foundations',
        description: 'Essential mathematical concepts for data science and machine learning'
    },
    'root': {
        icon: 'fas fa-project-diagram',
        title: 'Core Algorithms & Models',
        description: 'Key machine learning algorithms and model selection techniques'
    }
};

// Global variables
let repositoryData = {};
let allFiles = [];
let isLiveData = false;