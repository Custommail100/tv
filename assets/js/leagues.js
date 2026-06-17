// Leagues Management Script

class LeaguesManager {
  constructor() {
    this.data = null;
    this.modal = new bootstrap.Modal(document.getElementById('leagueModal'));
    this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.setupEventListeners();
      this.loadCategoryOptions();
      this.render();
    } catch (error) {
      console.error('Error initializing leagues:', error);
      showToast('Error loading leagues', 'error');
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
    document.getElementById('saveLeagueBtn').addEventListener('click', () => this.saveLeague());
    document.getElementById('confirmBtn').addEventListener('click', () => this.confirmDelete());
    document.getElementById('searchInput').addEventListener('input', () => this.render());

    document.getElementById('leagueModal').addEventListener('hidden.bs.modal', () => {
      this.clearForm();
    });
  }

  loadCategoryOptions() {
    const select = document.getElementById('leagueCategory');
    select.innerHTML = '<option value="">Select Category</option>';
    this.data.categories.forEach((category) => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  }

  render() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = this.data.leagues.filter((league) => league.name.toLowerCase().includes(searchTerm));

    const tbody = document.getElementById('leaguesTableBody');
    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center text-muted py-4">
            <i class="fas fa-inbox"></i> No leagues found
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map((league) => {
      const category = this.data.categories.find((c) => c.id === league.category);
      const matchCount = this.data.matches.filter((m) => m.league === league.id).length;

      return `
        <tr>
          <td><strong>${league.name}</strong></td>
          <td>${category ? category.name : 'Unknown'}</td>
          <td><span class="badge bg-primary">${matchCount}</span></td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="leaguesManager.editLeague('${league.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="leaguesManager.deleteLeague('${league.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  editLeague(id) {
    const league = this.data.leagues.find((l) => l.id === id);
    if (!league) return;

    document.getElementById('leagueName').value = league.name;
    document.getElementById('leagueCategory').value = league.category;
    document.getElementById('leagueId').value = id;
    document.getElementById('leagueModalTitle').textContent = 'Edit League';
    this.modal.show();
  }

  deleteLeague(id) {
    this.deleteId = id;
    document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this league?';
    this.confirmModal.show();
  }

  async confirmDelete() {
    this.data.leagues = this.data.leagues.filter((l) => l.id !== this.deleteId);
    await this.saveData();
    this.confirmModal.hide();
    this.render();
    showToast('League deleted successfully', 'success');
  }

  async saveLeague() {
    const name = document.getElementById('leagueName').value.trim();
    const category = document.getElementById('leagueCategory').value;
    const id = document.getElementById('leagueId').value;

    if (!name || !category) {
      showToast('Please fill all fields', 'warning');
      return;
    }

    if (id) {
      const league = this.data.leagues.find((l) => l.id === id);
      if (league) {
        league.name = name;
        league.category = category;
      }
    } else {
      this.data.leagues.push({
        id: Utils.generateId(),
        name: name,
        category: category,
      });
    }

    await this.saveData();
    this.modal.hide();
    this.render();
    showToast('League saved successfully', 'success');
  }

  async saveData() {
    try {
      await github.updateFile(this.data, 'Update leagues');
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Error saving data', 'error');
    }
  }

  clearForm() {
    document.getElementById('leagueForm').reset();
    document.getElementById('leagueId').value = '';
    document.getElementById('leagueModalTitle').textContent = 'Add League';
  }
}

let leaguesManager;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    leaguesManager = new LeaguesManager();
  });
} else {
  leaguesManager = new LeaguesManager();
}
