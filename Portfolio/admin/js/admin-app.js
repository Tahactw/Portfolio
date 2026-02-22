/* ══════════════════════════════════════════════
   ADMIN-APP — Main admin orchestrator
   ══════════════════════════════════════════════ */

const AdminApp = (() => {
  let currentSection = 'overview';

  async function init() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Init auth
    await Auth.init();

    // Init sub-modules
    Ordering.init();
    Preview.init();

    // Sidebar navigation
    document.querySelectorAll('.sidebar__link').forEach(link => {
      link.addEventListener('click', () => {
        const section = link.dataset.section;
        if (section) navigateTo(section);
      });
    });

    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', save);
    }

    // Sidebar toggle (mobile)
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Re-initialize icons after any DOM change
    const observer = new MutationObserver(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
    const adminContent = document.getElementById('adminContent');
    if (adminContent) {
      observer.observe(adminContent, { childList: true, subtree: true });
    }
  }

  async function loadDashboard() {
    try {
      const data = await ApiClient.getSite();
      Editor.setData(data);
      navigateTo('overview');
    } catch (err) {
      showToast('Failed to load site data: ' + err.message, 'error');
    }
  }

  function navigateTo(section) {
    currentSection = section;

    // Update sidebar active state
    document.querySelectorAll('.sidebar__link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === section);
    });

    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
      const titles = {
        overview: 'Overview',
        meta: 'Site Metadata',
        hero: 'Hero Section',
        about: 'About Section',
        skills: 'Skills',
        projects: 'Projects',
        experience: 'Experience',
        contact: 'Contact',
        settings: 'Settings',
        json: 'Raw JSON',
      };
      pageTitle.textContent = titles[section] || section;
    }

    renderSection(section);
  }

  function renderSection(section) {
    const content = document.getElementById('adminContent');
    if (!content) return;

    // Collect current form data before switching
    if (currentSection !== section && currentSection !== 'json') {
      Editor.collectFormData();
    }

    const renderers = {
      overview: () => Editor.renderOverview(),
      meta: () => Editor.renderMeta(),
      hero: () => Editor.renderHero(),
      about: () => Editor.renderAbout(),
      skills: () => Editor.renderSkills(),
      projects: () => Editor.renderProjects(),
      experience: () => Editor.renderExperience(),
      contact: () => Editor.renderContact(),
      settings: () => Editor.renderSettings(),
      json: () => JsonEditor.render(),
    };

    const renderFn = renderers[section];
    content.innerHTML = renderFn ? renderFn() : '<p>Unknown section</p>';

    // Track input changes
    content.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => Editor.markDirty());
      input.addEventListener('change', () => Editor.markDirty());
    });
  }

  function refreshCurrentSection() {
    renderSection(currentSection);
  }

  async function save() {
    const saveBtn = document.getElementById('saveBtn');

    try {
      // Collect form data
      if (currentSection === 'json') {
        const data = JsonEditor.collectData();
        if (!data) {
          showToast('Fix JSON errors before saving', 'error');
          return;
        }
      } else {
        Editor.collectFormData();
      }

      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i data-lucide="loader" style="width:16px;height:16px;" class="spin"></i> Saving...';
      }

      await ApiClient.updateSite(Editor.getData());
      Editor.markClean();
      showToast('Changes saved successfully!', 'success');
    } catch (err) {
      showToast('Save failed: ' + err.message, 'error');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i data-lucide="save" style="width:16px;height:16px;"></i> Save Changes';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }
  }

  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const icons = { success: 'check-circle', error: 'alert-circle', warning: 'alert-triangle' };
    toast.innerHTML = `<i data-lucide="${icons[type] || 'info'}" style="width:16px;height:16px;flex-shrink:0;"></i> ${message}`;

    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  return { init, loadDashboard, navigateTo, refreshCurrentSection, save, showToast };
})();

// Boot
document.addEventListener('DOMContentLoaded', AdminApp.init);
