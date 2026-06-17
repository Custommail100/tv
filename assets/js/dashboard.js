// Dashboard Script

class Dashboard {
  constructor() {
    this.data = null;
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.render();
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      showToast('Error loading dashboard data', 'error');
    }
  }

  async loadData() {
    try {
      const result = await github.getFile();
      this.data = result ? result.content : this.getEmptyData();
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = this.getEmptyData();
    }
  }

  getEmptyData() {
    return {
      categories: [],
      leagues: [],
      matches: [],
    };
  }

  render() {
    this.updateStats();
    this.updateMatchStatus();
    this.displayRecentMatches();
  }

  updateStats() {
    document.getElementById('totalCategories').textContent = this.data.categories.length;
    document.getElementById('totalLeagues').textContent = this.data.leagues.length;
    document.getElementById('totalMatches').textContent = this.data.matches.length;
    
    const totalSources = this.data.matches.reduce((sum, match) => sum + (match.sources ? match.sources.length : 0), 0);
    document.getElementById('totalSources').textContent = totalSources;
  }

  updateMatchStatus() {
    let upcoming = 0;
    let live = 0;
    let finished = 0;

    this.data.matches.forEach((match) => {
      const status = Utils.getMatchStatus(match.start_time, match.finish_time);
      if (status === 'upcoming') upcoming++;
      else if (status === 'live') live++;
      else if (status === 'finished') finished++;
    });

    document.getElementById('upcomingCount').textContent = upcoming;
    document.getElementById('liveCount').textContent = live;
    document.getElementById('finishedCount').textContent = finished;
  }

  displayRecentMatches() {
    const container = document.getElementById('recentMatchesContainer');
    const recent = this.data.matches.slice(-5).reverse();

    if (recent.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted py-4">
          <i class="fas fa-inbox"></i> No matches yet
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Match</th>
              <th>League</th>
              <th>Start Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${recent.map((match) => `
              <tr>
                <td>${match.teamA.name} vs ${match.teamB.name}</td>
                <td>${match.league}</td>
                <td>${Utils.formatDate(match.start_time)}</td>
                <td>
                  <span class="status-badge ${Utils.getMatchStatus(match.start_time, match.finish_time)}">
                    ${Utils.getMatchStatus(match.start_time, match.finish_time).toUpperCase()}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
  });
} else {
  new Dashboard();
}
