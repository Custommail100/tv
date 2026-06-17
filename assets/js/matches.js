// Matches Management Script

class MatchesManager {
  constructor() {
    this.data = null;
    this.currentPage = 1;
    this.filteredMatches = [];
    this.modal = new bootstrap.Modal(document.getElementById('matchModal'));
    this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.setupEventListeners();
      this.loadOptions();
      this.render();
    } catch (error) {
      console.error('Error initializing matches:', error);
      showToast('Error loading matches', 'error');
    }
  }

  async loadData() {
    const result = await github.getFile();
    this.data = result ? result.content : this.getEmptyData();
  }

  getEmptyData() {
    return {
      categories: [],
      leagues: [],
      matches: [],
    };
  }

  setupEventListeners() {
    document.getElementById('saveMatchBtn').addEventListener('click', () => this.saveMatch());
    document.getElementById('addSourceBtn').addEventListener('click', () => this.addSourceField());
    document.getElementById('confirmBtn').addEventListener('click', () => this.confirmDelete());
    document.getElementById('searchInput').addEventListener('input', () => this.filterMatches());
    document.getElementById('categoryFilter').addEventListener('change', () => this.filterMatches());
    document.getElementById('leagueFilter').addEventListener('change', () => this.filterMatches());
    document.getElementById('statusFilter').addEventListener('change', () => this.filterMatches());

    document.getElementById('matchModal').addEventListener('hidden.bs.modal', () => {
      this.clearForm();
    });

    document.getElementById('matchCategory').addEventListener('change', () => this.loadLeagueOptions());
  }

  loadOptions() {
    this.loadCategoryOptions();
    this.loadLeagueOptions();
  }

  loadCategoryOptions() {
    const selects = [document.getElementById('matchCategory'), document.getElementById('categoryFilter')];
    selects.forEach((select) => {
      if (!select) return;
      const currentValue = select.value;
      select.innerHTML = '<option value="">All Categories</option>';
      this.data.categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
      select.value = currentValue;
    });
  }

  loadLeagueOptions() {
    const categoryId = document.getElementById('matchCategory').value;
    const select = document.getElementById('matchLeague');
    select.innerHTML = '<option value="">Select League</option>';

    const filtered = this.data.leagues.filter((league) => !categoryId || league.category === categoryId);
    filtered.forEach((league) => {
      const option = document.createElement('option');
      option.value = league.id;
      option.textContent = league.name;
      select.appendChild(option);
    });

    // Also update filter options
    const filterSelect = document.getElementById('leagueFilter');
    const currentValue = filterSelect.value;
    filterSelect.innerHTML = '<option value="">All Leagues</option>';
    this.data.leagues.forEach((league) => {
      const option = document.createElement('option');
      option.value = league.id;
      option.textContent = league.name;
      filterSelect.appendChild(option);
    });
    filterSelect.value = currentValue;
  }

  filterMatches() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const league = document.getElementById('leagueFilter').value;
    const status = document.getElementById('statusFilter').value;

    this.filteredMatches = this.data.matches.filter((match) => {
      const searchMatch = `${match.teamA.name} ${match.teamB.name} ${match.title}`.toLowerCase().includes(search);
      const categoryMatch = !category || match.category === category;
      const leagueMatch = !league || match.league === league;
      const statusMatch = !status || Utils.getMatchStatus(match.start_time, match.finish_time) === status;

      return searchMatch && categoryMatch && leagueMatch && statusMatch;
    });

    this.currentPage = 1;
    this.render();
  }

  render() {
    this.renderMatches();
    this.renderPagination();
  }

  renderMatches() {
    const container = document.getElementById('matchesContainer');
    const start = (this.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
    const end = start + CONFIG.ITEMS_PER_PAGE;
    const page = this.filteredMatches.slice(start, end);

    if (page.length === 0) {
      container.innerHTML = `
        <div class="col-12">
          <div class="text-center text-muted py-5">
            <i class="fas fa-inbox"></i>
            <p>No matches found</p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = page.map((match) => {
      const status = Utils.getMatchStatus(match.start_time, match.finish_time);
      const category = this.data.categories.find((c) => c.id === match.category);
      const league = this.data.leagues.find((l) => l.id === match.league);

      return `
        <div class="col-lg-6 col-xl-4">
          <div class="match-card">
            <div class="match-card-header">
              <h6 class="mb-0">${league ? league.name : 'Unknown'}</h6>
            </div>
            <div class="match-card-body">
              <h5>${match.title}</h5>
              <div class="match-teams">
                <div class="team">
                  ${match.teamA.flag ? `<img src="${match.teamA.flag}" alt="${match.teamA.name}" class="team-flag">` : ''}
                  <div>${match.teamA.name}</div>
                </div>
                <div class="vs">vs</div>
                <div class="team">
                  ${match.teamB.flag ? `<img src="${match.teamB.flag}" alt="${match.teamB.name}" class="team-flag">` : ''}
                  <div>${match.teamB.name}</div>
                </div>
              </div>
              <div class="small text-muted">
                <p class="mb-2"><i class="fas fa-clock"></i> ${Utils.formatDate(match.start_time)}</p>
                <p class="mb-2"><i class="fas fa-video"></i> ${match.sources ? match.sources.length : 0} sources</p>
              </div>
              <span class="status-badge ${status}">${status.toUpperCase()}</span>
              <div class="mt-3">
                <button class="btn btn-sm btn-primary" onclick="matchesManager.editMatch('${match.id}')">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="matchesManager.deleteMatch('${match.id}')">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderPagination() {
    const container = document.getElementById('paginationContainer');
    const totalPages = Math.ceil(this.filteredMatches.length / CONFIG.ITEMS_PER_PAGE);

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    if (this.currentPage > 1) {
      html += `<li class="page-item"><a class="page-link" href="#" onclick="matchesManager.setPage(${this.currentPage - 1})">Previous</a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      const active = i === this.currentPage ? 'active' : '';
      html += `<li class="page-item ${active}"><a class="page-link" href="#" onclick="matchesManager.setPage(${i})">${i}</a></li>`;
    }

    if (this.currentPage < totalPages) {
      html += `<li class="page-item"><a class="page-link" href="#" onclick="matchesManager.setPage(${this.currentPage + 1})">Next</a></li>`;
    }

    container.innerHTML = html;
  }

  setPage(page) {
    this.currentPage = page;
    this.render();
    window.scrollTo(0, 0);
  }

  editMatch(id) {
    const match = this.data.matches.find((m) => m.id === id);
    if (!match) return;

    document.getElementById('matchCategory').value = match.category;
    this.loadLeagueOptions();
    setTimeout(() => {
      document.getElementById('matchLeague').value = match.league;
    }, 100);
    document.getElementById('matchTitle').value = match.title;
    document.getElementById('teamAName').value = match.teamA.name;
    document.getElementById('teamAFlag').value = match.teamA.flag;
    document.getElementById('teamBName').value = match.teamB.name;
    document.getElementById('teamBFlag').value = match.teamB.flag;
    document.getElementById('startTime').value = new Date(match.start_time).toISOString().slice(0, 16);
    document.getElementById('finishTime').value = new Date(match.finish_time).toISOString().slice(0, 16);
    document.getElementById('matchId').value = id;

    // Load sources
    const sourcesContainer = document.getElementById('sourcesContainer');
    sourcesContainer.innerHTML = '';
    if (match.sources && match.sources.length > 0) {
      match.sources.forEach((source) => {
        this.addSourceField(source.name, source.url);
      });
    }

    document.getElementById('matchModalTitle').textContent = 'Edit Match';
    this.modal.show();
  }

  deleteMatch(id) {
    this.deleteId = id;
    document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this match?';
    this.confirmModal.show();
  }

  async confirmDelete() {
    this.data.matches = this.data.matches.filter((m) => m.id !== this.deleteId);
    await this.saveData();
    this.confirmModal.hide();
    this.filterMatches();
    showToast('Match deleted successfully', 'success');
  }

  addSourceField(name = '', url = '') {
    const container = document.getElementById('sourcesContainer');
    const id = Utils.generateId();
    const sourceHTML = `
      <div class="input-group mb-2" id="source-${id}">
        <input type="text" class="form-control" placeholder="Source name (Main, Backup, etc.)" value="${name}">
        <input type="text" class="form-control" placeholder="Stream URL" value="${url}">
        <button class="btn btn-outline-danger" type="button" onclick="this.closest('[id^=source-]').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', sourceHTML);
  }

  async saveMatch() {
    const category = document.getElementById('matchCategory').value;
    const league = document.getElementById('matchLeague').value;
    const title = document.getElementById('matchTitle').value.trim();
    const teamAName = document.getElementById('teamAName').value.trim();
    const teamAFlag = document.getElementById('teamAFlag').value.trim();
    const teamBName = document.getElementById('teamBName').value.trim();
    const teamBFlag = document.getElementById('teamBFlag').value.trim();
    const startTime = document.getElementById('startTime').value;
    const finishTime = document.getElementById('finishTime').value;
    const id = document.getElementById('matchId').value;

    if (!category || !league || !title || !teamAName || !teamBName || !startTime || !finishTime) {
      showToast('Please fill all required fields', 'warning');
      return;
    }

    // Get sources
    const sources = [];
    document.querySelectorAll('#sourcesContainer > div').forEach((sourceDiv) => {
      const inputs = sourceDiv.querySelectorAll('input');
      const name = inputs[0].value.trim();
      const url = inputs[1].value.trim();
      if (name && url) {
        sources.push({ name, url, enabled: true });
      }
    });

    const matchData = {
      id: id || Utils.generateId(),
      category,
      league,
      title,
      teamA: { name: teamAName, flag: teamAFlag },
      teamB: { name: teamBName, flag: teamBFlag },
      sources,
      start_time: new Date(startTime).toISOString(),
      finish_time: new Date(finishTime).toISOString(),
    };

    if (id) {
      const index = this.data.matches.findIndex((m) => m.id === id);
      if (index !== -1) {
        this.data.matches[index] = matchData;
      }
    } else {
      this.data.matches.push(matchData);
    }

    await this.saveData();
    this.modal.hide();
    this.filterMatches();
    showToast('Match saved successfully', 'success');
  }

  async saveData() {
    try {
      await github.updateFile(this.data, 'Update matches');
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Error saving data', 'error');
    }
  }

  clearForm() {
    document.getElementById('matchForm').reset();
    document.getElementById('matchId').value = '';
    document.getElementById('sourcesContainer').innerHTML = '';
    document.getElementById('matchModalTitle').textContent = 'Add Match';
  }
}

let matchesManager;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    matchesManager = new MatchesManager();
  });
} else {
  matchesManager = new MatchesManager();
}
