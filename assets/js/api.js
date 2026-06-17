// GitHub API Helper Functions

class GitHubAPI {
  constructor() {
    this.config = Utils.getGitHubConfig();
  }

  // Get file from GitHub
  async getFile() {
    const filePath = 'match.json'; // Explicitly set to match.json
    const url = `${CONFIG.GITHUB_API}/repos/${this.config.owner}/${this.config.repo}/contents/${filePath}?ref=${this.config.branch}`;

    try {
      console.log('Fetching from:', url);
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('File not found on GitHub');
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
    const filePath = 'match.json'; // Explicitly set to match.json
    const url = `${CONFIG.GITHUB_API}/repos/${this.config.owner}/${this.config.repo}/contents/${filePath}`;

    try {
      // Get current file to get SHA
      const current = await this.getFile();
      
      if (!current) {
        throw new Error('Could not fetch current file SHA from GitHub. File may not exist.');
      }

      const sha = current.sha;

      console.log('Updating file with SHA:', sha);
      console.log('Content to upload:', content);

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
          sha: sha, // IMPORTANT: SHA is required for updates
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('GitHub API Error:', errorData);
        throw new Error(`GitHub API error: ${response.status} - ${errorData.message}`);
      }

      const result = await response.json();
      console.log('File updated successfully:', result);
      return result;
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
