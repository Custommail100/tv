// Settings Script

class SettingsManager {
  constructor() {
    this.init();
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
  }

  loadSettings() {
    const config = Utils.getGitHubConfig();
    document.getElementById('githubOwner').value = config.owner;
    document.getElementById('githubRepo').value = config.repo;
    document.getElementById('githubBranch').value = config.branch;
    document.getElementById('githubToken').value = config.token;
    document.getElementById('filePath').value = config.filePath;
    this.updateApiUrl();
  }

  setupEventListeners() {
    document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettings());
    document.getElementById('testConnectionBtn').addEventListener('click', () => this.testConnection());
    document.getElementById('toggleToken').addEventListener('click', (e) => this.toggleTokenVisibility(e));
    document.getElementById('copyApiBtn').addEventListener('click', () => this.copyApiUrl());
    document.getElementById('githubOwner').addEventListener('input', () => this.updateApiUrl());
    document.getElementById('githubRepo').addEventListener('input', () => this.updateApiUrl());
    document.getElementById('githubBranch').addEventListener('input', () => this.updateApiUrl());
    document.getElementById('filePath').addEventListener('input', () => this.updateApiUrl());
  }

  saveSettings() {
    const config = {
      owner: document.getElementById('githubOwner').value.trim(),
      repo: document.getElementById('githubRepo').value.trim(),
      branch: document.getElementById('githubBranch').value.trim(),
      token: document.getElementById('githubToken').value.trim(),
      filePath: document.getElementById('filePath').value.trim(),
    };

    if (!config.owner || !config.repo || !config.token) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    Utils.saveGitHubConfig(config);
    showToast('Settings saved successfully', 'success');
  }

  async testConnection() {
    const btn = document.querySelector('#testConnectionBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

    try {
      const result = await github.testConnection();
      showToast(`Connected as ${result.login}!`, 'success');
    } catch (error) {
      showToast('Connection failed: ' + error.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-plug"></i> Test Connection';
    }
  }

  toggleTokenVisibility(e) {
    const input = document.getElementById('githubToken');
    const icon = e.target.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }

  updateApiUrl() {
    const owner = document.getElementById('githubOwner').value || 'OWNER';
    const repo = document.getElementById('githubRepo').value || 'REPO';
    const branch = document.getElementById('githubBranch').value || 'main';
    const filePath = document.getElementById('filePath').value || 'match.json';
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    document.getElementById('apiUrl').textContent = url;
  }

  copyApiUrl() {
    const url = document.getElementById('apiUrl').textContent;
    navigator.clipboard.writeText(url).then(() => {
      showToast('API URL copied to clipboard', 'success');
    });
  }
}

let settingsManager;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
  });
} else {
  settingsManager = new SettingsManager();
}
