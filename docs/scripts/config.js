// config.js
// Configuration file containing GitHub repository settings and API endpoints

// GitHub repository configuration
const GITHUB_USER = 'efrat-dev';
const GITHUB_REPO = 'ai-knowledge-notebooks';
const GITHUB_TREE_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/git/trees/main?recursive=1`;
const NOTEBOOKS_FOLDER = 'notebooks/';

// Global application state variables
let repositoryData = {};
let allFiles = [];
let isLiveData = false;