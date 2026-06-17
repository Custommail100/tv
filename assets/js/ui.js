// UI Helper Functions

// Show Toast Notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fas fa-${getToastIcon(type)}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function getToastIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle',
  };
  return icons[type] || icons.info;
}

// Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, isDarkMode);
}

// Initialize Dark Mode
function initDarkMode() {
  const isDarkMode = localStorage.getItem(STORAGE_KEYS.DARK_MODE) === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
}

// Toggle Sidebar
function toggleSidebar() {
  const wrapper = document.getElementById('wrapper');
  const sidebar = document.getElementById('sidebar');
  wrapper.classList.toggle('collapsed');
  sidebar.classList.toggle('show');
}

// Setup Event Listeners
function setupUIEventListeners() {
  const darkModeBtn = document.getElementById('toggleDarkMode');
  const sidebarToggle = document.getElementById('toggleSidebar');
  const logoutBtn = document.getElementById('logoutBtn');

  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', toggleDarkMode);
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Utils.logout();
    });
  }

  // Close sidebar on mobile when link is clicked
  const navLinks = document.querySelectorAll('.sidebar .nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        toggleSidebar();
      }
    });
  });
}

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  setupUIEventListeners();
});

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
