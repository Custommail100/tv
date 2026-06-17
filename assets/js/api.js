// GitHub API Helper Functions

class GitHubAPI {
  constructor() {
    this.config = Utils.getGitHubConfig();
  }

  // Get file from GitHub
  async getFile() {
    const url = `${CONFIG.GITHUB_API}/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.filePath}?ref=${this.config.branch}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: JSON.parse(atob(data.content)),
        sha: data.sha,
      };
    } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
    }
  }

  // Update file on GitHub
  async updateFile(content, message) {
    const url = `${CONFIG.GITHUB_API}/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.filePath}`;

    try {
      // Get current file to get SHA
      const current = await this.getFile();
      const sha = current ? current.sha : undefined;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message || 'Update match.json',
          content: btoa(JSON.stringify(content, null, 2)),
          branch: this.config.branch,
          ...(sha && { sha }),
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    const url = `${CONFIG.GITHUB_API}/user`;

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token or connection failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error testing connection:', error);
      throw error;
    }
  }

  // Upload file to GitHub
  async uploadFile(filePath, fileContent, message) {
    const url = `${CONFIG.GITHUB_API}/repos/${this.config.owner}/${this.config.repo}/contents/${filePath}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message || 'Upload file',
          content: btoa(fileContent),
          branch: this.config.branch,
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        url: data.content.download_url,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

// Create global instance
const github = new GitHubAPI();
