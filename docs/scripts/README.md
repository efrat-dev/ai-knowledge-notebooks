# AI Knowledge Hub - Core Architecture & System Overview

## 📚 Full Documentation – Navigation Guide
- **[📋 Core Architecture & System Overview](core_architecture_overview)** ← You are here  
- **[🎨 UI Components & User Interface](ui_components_interface)**  
- **[📁 File Management & Modal System](file_management_modals)**  
- **[🔧 Advanced Features & Integration](advanced_features_integration)**

---

## 🏗️ Overview

This documentation covers the JavaScript architecture that powers the AI Knowledge Hub - a dynamic web application for browsing and accessing Jupyter notebooks containing AI, ML, and Data Science study materials. The application is built with vanilla JavaScript using a modular architecture.

## 📁 Project Structure

```
scripts/
├── core/                          # Core application modules
│   ├── config.js                  # Configuration and constants
│   ├── appInitializer.js          # Main application initialization
│   ├── dataLoader.js              # GitHub API data loading
│   └── statusManager.js           # Status indicator management
├── ui/                            # User interface modules
│   ├── uiRenderer.js              # Dynamic UI component rendering
│   ├── searchHandler.js           # Search functionality
│   ├── categoryAnalyzer.js        # Category content analysis
│   ├── eventHandlers.js           # Global event management
│   └── visualEffects.js           # Animations and visual effects
└── fileManager/                   # File management and modal system
    ├── fileManager.js             # Core file operations
    ├── notebookViewer.js          # Notebook content rendering
    ├── markdownParser.js          # Markdown parsing and rendering
    ├── modalHistory.js            # Navigation history system
    └── keyboardNavigation.js      # Keyboard shortcuts and navigation
```

## 🚀 Core Architecture

### Application Flow
1. **Initialization** - Load configuration and set up event listeners
2. **Data Loading** - Fetch repository structure from GitHub API
3. **UI Rendering** - Generate dynamic category cards and file listings
4. **User Interaction** - Handle file selection, search, and navigation
5. **Content Display** - Render notebook content in modal with full navigation

### Key Design Patterns
- **Modular Architecture**: Each functionality is separated into focused modules
- **Event-Driven**: Extensive use of event listeners for user interactions
- **Progressive Enhancement**: Graceful degradation when GitHub API is unavailable
- **State Management**: Global state tracking for application data and user context

---

## 📋 Core Modules

### 1. Configuration Module (`config.js`)

Centralizes all configuration settings and global variables for the application.

```javascript
const GITHUB_USER = 'efrat-dev';
const GITHUB_REPO = 'ai-knowledge-notebooks';
const GITHUB_TREE_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/git/trees/main?recursive=1`;
```

**Key Features:**
- GitHub repository configuration
- API endpoint definitions
- Global state variables initialization
- Constants for folder structures

**Global Variables:**
- `repositoryData`: Stores processed GitHub repository structure
- `allFiles`: Array of all notebook files
- `isLiveData`: Boolean indicating data source status

### 2. Application Initializer (`appInitializer.js`)

Orchestrates the complete application startup sequence.

```javascript
async function initializeApp() {
    updateStatus('loading', 'Loading data...');
    try {
        await loadLiveData();
        updateStatus('live', 'Current data');
        renderCategories();
        setupSearch();
        createParticles();
    } catch (error) {
        handleOfflineMode();
    }
}
```

**Responsibilities:**
- Coordinate application startup
- Handle online/offline states
- Initialize UI components
- Set up visual effects
- Error handling and user feedback

**Key Functions:**
- `initializeApp()`: Main initialization orchestrator
- Error handling for network failures
- UI state management during startup

### 3. Data Loader (`dataLoader.js`)

Manages all data fetching operations from the GitHub API with robust error handling.

```javascript
async function loadLiveData() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
        const response = await fetch(GITHUB_TREE_URL, {
            signal: controller.signal,
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });
        // Process repository structure...
    } catch (error) {
        throw error;
    }
}
```

**Features:**
- GitHub API integration with proper headers
- Request timeout handling (5 second limit)
- Repository tree parsing and processing
- File categorization by directory structure
- Statistics calculation (total files, folders)
- Error handling with detailed error messages

**Data Processing:**
- Filters `.ipynb` files from repository tree
- Organizes files by directory structure
- Removes path prefixes for clean organization
- Updates UI statistics in real-time

### 4. Status Manager (`statusManager.js`)

Provides visual feedback about application state and connectivity.

```javascript
function updateStatus(status, text) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    indicator.className = `status-indicator status-${status}`;
    statusText.textContent = text;
}
```

**Status Types:**
- `loading`: Data is being fetched
- `live`: Successfully connected to GitHub API
- `error`: Connection failed or data unavailable
- Custom status messages for user feedback

**Visual Indicators:**
- Color-coded status dots
- Dynamic text updates
- CSS class-based styling system

---

## 📚 View Details
- **[🎨 UI Components & User Interface](ui_components_interface)** 
- **[📁 File Management & Modal System](file_management_modals)** 
- **[🔧 Advanced Features & Integration](advanced_features_integration)** 