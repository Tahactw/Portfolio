/* ══════════════════════════════════════════════
   AUTH — Login/logout, session management
   ══════════════════════════════════════════════ */

const Auth = (() => {
  const STORAGE_KEY = 'portfolio_admin_token';

  function init() {
    const form = document.getElementById('authForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (form) {
      form.addEventListener('submit', handleLogin);
    }
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }

    // Check stored token
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      ApiClient.setToken(stored);
      return tryAutoLogin();
    }

    return Promise.resolve(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    const input = document.getElementById('tokenInput');
    const error = document.getElementById('authError');

    if (!input.value.trim()) {
      if (error) error.textContent = 'Please enter a token';
      return;
    }

    ApiClient.setToken(input.value.trim());

    try {
      const valid = await ApiClient.testAuth();
      if (valid) {
        sessionStorage.setItem(STORAGE_KEY, input.value.trim());
        showDashboard();
      } else {
        if (error) error.textContent = 'Invalid token';
      }
    } catch {
      if (error) error.textContent = 'Connection failed';
    }
  }

  async function tryAutoLogin() {
    try {
      const valid = await ApiClient.testAuth();
      if (valid) {
        showDashboard();
        return true;
      }
    } catch {}
    sessionStorage.removeItem(STORAGE_KEY);
    return false;
  }

  function showDashboard() {
    const auth = document.getElementById('authScreen');
    const dash = document.getElementById('adminDashboard');
    if (auth) auth.style.display = 'none';
    if (dash) dash.style.display = 'flex';

    // Initialize dashboard
    if (typeof AdminApp !== 'undefined' && AdminApp.loadDashboard) {
      AdminApp.loadDashboard();
    }
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    ApiClient.setToken('');
    const auth = document.getElementById('authScreen');
    const dash = document.getElementById('adminDashboard');
    if (auth) auth.style.display = 'flex';
    if (dash) dash.style.display = 'none';
  }

  function isAuthenticated() {
    return !!ApiClient.getToken();
  }

  return { init, logout, isAuthenticated };
})();
