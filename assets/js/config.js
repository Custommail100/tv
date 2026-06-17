// Configuration and Constants
const CONFIG = {
  GITHUB_API: 'https://api.github.com',
  GITHUB_RAW: 'https://raw.githubusercontent.com',
  ITEMS_PER_PAGE: 10,
  AUTO_SAVE_INTERVAL: 5000,
};

// Local Storage Keys
const STORAGE_KEYS = {
  GITHUB_OWNER: 'github_owner',
  GITHUB_REPO: 'github_repo',
  GITHUB_BRANCH: 'github_branch',
  GITHUB_TOKEN: 'github_token',
  FILE_PATH: 'file_path',
  DARK_MODE: 'dark_mode',
  AUTH_TOKEN: 'auth_token',
  ADMIN_AUTHENTICATED: 'admin_authenticated',
  ADMIN_USERNAME: 'admin_username',
};

// Utility Functions
const Utils = {
  // Get auth token from localStorage
  getAuthToken: () => {
    const token = localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN);
    if (!token) {
      window.location.href = 'auth.html';
      return null;
    }
    return token;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN);
  },

  // Check if admin is authenticated
  isAdminAuthenticated: () => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTHENTICATED) === 'true';
  },

  // Get GitHub configuration
  getGitHubConfig: () => {
    return {
      owner: localStorage.getItem(STORAGE_KEYS.GITHUB_OWNER) || '',
      repo: localStorage.getItem(STORAGE_KEYS.GITHUB_REPO) || '',
      branch: localStorage.getItem(STORAGE_KEYS.GITHUB_BRANCH) || 'main',
      token: localStorage.getItem(STORAGE_KEYS.GITHUB_TOKEN) || '',
      filePath: localStorage.getItem(STORAGE_KEYS.FILE_PATH) || 'match.json',
    };
  },

  // Save GitHub configuration
  saveGitHubConfig: (config) => {
    localStorage.setItem(STORAGE_KEYS.GITHUB_OWNER, config.owner);
    localStorage.setItem(STORAGE_KEYS.GITHUB_REPO, config.repo);
    localStorage.setItem(STORAGE_KEYS.GITHUB_BRANCH, config.branch);
    localStorage.setItem(STORAGE_KEYS.GITHUB_TOKEN, config.token);
    localStorage.setItem(STORAGE_KEYS.FILE_PATH, config.filePath);
  },

  // Generate unique ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Format date
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  },

  // Get match status
  getMatchStatus: (startTime, finishTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const finish = new Date(finishTime);

    if (now < start) return 'upcoming';
    if (now > finish) return 'finished';
    return 'live';
  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.GITHUB_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.GITHUB_OWNER);
    localStorage.removeItem(STORAGE_KEYS.GITHUB_REPO);
    localStorage.removeItem(STORAGE_KEYS.GITHUB_BRANCH);
    localStorage.removeItem(STORAGE_KEYS.FILE_PATH);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTHENTICATED);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USERNAME);
    window.location.href = 'auth.html';
  },
};

// Check authentication on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Skip auth check for auth and login pages
    if (!window.location.pathname.includes('auth.html') && 
        !window.location.pathname.includes('login.html') &&
        !Utils.isAuthenticated()) {
      window.location.href = 'auth.html';
    }
  });
} else {
  // Skip auth check for auth and login pages
  if (!window.location.pathname.includes('auth.html') && 
      !window.location.pathname.includes('login.html') &&
      !Utils.isAuthenticated()) {
    window.location.href = 'auth.html';
  }
}
