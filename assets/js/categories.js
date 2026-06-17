// Categories Management Script

class CategoriesManager {
  constructor() {
    this.data = null;
    this.modal = new bootstrap.Modal(document.getElementById('categoryModal'));
    this.confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    this.init();
  }

  async init() {
    try {
      await this.loadData();
      this.setupEventListeners();
      this.render();
    } catch (error) {
      console.error('Error initializing categories:', error);
      showToast('Error loading categories', 'error');
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
    document.getElementById('saveCategoryBtn').addEventListener('click', () => this.saveCategory());
    document.getElementById('confirmBtn').addEventListener('click', () => this.confirmDelete());

    // Clear form when modal is hidden
    document.getElementById('categoryModal').addEventListener('hidden.bs.modal', () => {
      this.clearForm();
    });
  }

  render() {
    const container = document.getElementById('categoriesContainer');
    if (this.data.categories.length === 0) {
      container.innerHTML = `
        <div class="col-12">
          <div class="text-center text-muted py-5">
            <i class="fas fa-inbox"></i>
            <p>No categories yet. Create your first category!</p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = this.data.categories.map((category) => `
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${category.name}</h5>
            <p class="text-muted mb-3">ID: ${category.id}</p>
            <button class="btn btn-sm btn-primary" onclick="categoriesManager.editCategory('${category.id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="categoriesManager.deleteCategory('${category.id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  editCategory(id) {
    const category = this.data.categories.find((c) => c.id === id);
    if (!category) return;

    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryId').value = id;
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    this.modal.show();
  }

  deleteCategory(id) {
    this.deleteId = id;
    document.getElementById('confirmMessage').textContent = 'Are you sure you want to delete this category? Associated leagues will remain.';
    this.confirmModal.show();
  }

  async confirmDelete() {
    this.data.categories = this.data.categories.filter((c) => c.id !== this.deleteId);
    await this.saveData();
    this.confirmModal.hide();
    this.render();
    showToast('Category deleted successfully', 'success');
  }

  async saveCategory() {
    const name = document.getElementById('categoryName').value.trim();
    const id = document.getElementById('categoryId').value;

    if (!name) {
      showToast('Please enter category name', 'warning');
      return;
    }

    if (id) {
      // Edit existing
      const category = this.data.categories.find((c) => c.id === id);
      if (category) {
        category.name = name;
      }
    } else {
      // Add new
      this.data.categories.push({
        id: Utils.generateId(),
        name: name,
      });
    }

    await this.saveData();
    this.modal.hide();
    this.render();
    showToast('Category saved successfully', 'success');
  }

  async saveData() {
    try {
      await github.updateFile(this.data, 'Update categories');
    } catch (error) {
      console.error('Error saving data:', error);
      showToast('Error saving data', 'error');
    }
  }

  clearForm() {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
  }
}

let categoriesManager;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    categoriesManager = new CategoriesManager();
  });
} else {
  categoriesManager = new CategoriesManager();
}
