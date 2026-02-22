/* ══════════════════════════════════════════════
   EDITOR — Form generators for each section
   ══════════════════════════════════════════════ */

const Editor = (() => {
  let siteData = null;
  let dirty = false;

  function setData(data) {
    siteData = JSON.parse(JSON.stringify(data));
    dirty = false;
  }

  function getData() {
    return siteData;
  }

  function isDirty() {
    return dirty;
  }

  function markDirty() {
    dirty = true;
  }

  function markClean() {
    dirty = false;
  }

  /**
   * Render the overview page.
   */
  function renderOverview() {
    if (!siteData) return '<p style="color:var(--c-text-dim)">Loading...</p>';

    const stats = [
      { label: 'Skills', value: (siteData.skills || []).length },
      { label: 'Projects', value: (siteData.projects || []).length },
      { label: 'Experience', value: (siteData.experience || []).length },
      { label: 'Social Links', value: (siteData.contact?.social || []).length },
    ];

    const statsHTML = stats.map(s =>
      `<div class="stat-card">
        <div class="stat-card__value">${s.value}</div>
        <div class="stat-card__label">${s.label}</div>
      </div>`
    ).join('');

    return `
      <div class="stats-grid">${statsHTML}</div>
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Quick Info</h3>
        </div>
        <div style="color:var(--c-text-dim); line-height:2;">
          <p><strong>Site Title:</strong> ${escapeHTML(siteData.meta?.title || 'Not set')}</p>
          <p><strong>Name:</strong> ${escapeHTML(siteData.hero?.name || 'Not set')}</p>
          <p><strong>Email:</strong> ${escapeHTML(siteData.contact?.email || 'Not set')}</p>
          <p><strong>Theme:</strong> ${escapeHTML(siteData.settings?.theme || 'dark')}</p>
        </div>
      </div>
    `;
  }

  /**
   * Render meta section editor.
   */
  function renderMeta() {
    const meta = siteData?.meta || {};
    return `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Site Metadata</h3>
        </div>
        <div class="form-group">
          <label class="form-label">Page Title</label>
          <input class="form-input" data-path="meta.title" value="${escapeAttr(meta.title || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" data-path="meta.description" rows="3">${escapeHTML(meta.description || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Theme Color</label>
          <input class="form-input" data-path="meta.themeColor" value="${escapeAttr(meta.themeColor || '#6c63ff')}" />
          <p class="form-hint">Hex color for browser theme (e.g. #6c63ff)</p>
        </div>
        <div class="form-group">
          <label class="form-label">Favicon URL</label>
          <input class="form-input" data-path="meta.favicon" value="${escapeAttr(meta.favicon || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label">OG Image URL</label>
          <input class="form-input" data-path="meta.ogImage" value="${escapeAttr(meta.ogImage || '')}" />
        </div>
      </div>
    `;
  }

  /**
   * Render hero section editor.
   */
  function renderHero() {
    const hero = siteData?.hero || {};
    const cta = hero.cta || {};
    return `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Hero Section</h3>
        </div>
        <div class="form-group">
          <label class="form-label">Greeting</label>
          <input class="form-input" data-path="hero.greeting" value="${escapeAttr(hero.greeting || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Name</label>
          <input class="form-input" data-path="hero.name" value="${escapeAttr(hero.name || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Tagline</label>
          <textarea class="form-textarea" data-path="hero.tagline" rows="2">${escapeHTML(hero.tagline || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">CTA Button Text</label>
          <input class="form-input" data-path="hero.cta.text" value="${escapeAttr(cta.text || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label">CTA Button Link</label>
          <input class="form-input" data-path="hero.cta.href" value="${escapeAttr(cta.href || '')}" />
        </div>
      </div>
    `;
  }

  /**
   * Render about section editor.
   */
  function renderAbout() {
    const about = siteData?.about || {};
    const paragraphs = (about.paragraphs || []).map((p, i) =>
      `<div class="form-group">
        <label class="form-label">Paragraph ${i + 1}</label>
        <textarea class="form-textarea" data-path="about.paragraphs.${i}" rows="3">${escapeHTML(p)}</textarea>
        <button class="btn btn--danger btn--sm" style="margin-top:0.5rem;" 
                onclick="Editor.removeArrayItem('about.paragraphs', ${i})">Remove</button>
      </div>`
    ).join('');

    return `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">About Section</h3>
          <button class="btn btn--ghost btn--sm" onclick="Editor.addArrayItem('about.paragraphs', '')">+ Add Paragraph</button>
        </div>
        <div class="form-group">
          <label class="form-label">Heading</label>
          <input class="form-input" data-path="about.heading" value="${escapeAttr(about.heading || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Image URL</label>
          <input class="form-input" data-path="about.image" value="${escapeAttr(about.image || '')}" />
        </div>
        ${paragraphs}
      </div>
    `;
  }

  /**
   * Render skills section editor.
   */
  function renderSkills() {
    const skills = siteData?.skills || [];
    const cards = skills.map((skill, i) => {
      const items = (skill.items || []).map(item => escapeHTML(item)).join(', ');
      return `
        <div class="array-item" data-index="${i}">
          <div class="array-item__header">
            <span class="array-item__number">#${i + 1}</span>
            <div>
              <button class="btn btn--danger btn--sm" onclick="Editor.removeArrayItem('skills', ${i})">Remove</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <input class="form-input" data-path="skills.${i}.category" value="${escapeAttr(skill.category || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Icon</label>
            <input class="form-input" data-path="skills.${i}.icon" value="${escapeAttr(skill.icon || '')}" />
            <p class="form-hint">Options: shield, code, layers, terminal, database, globe, server, lock</p>
          </div>
          <div class="form-group">
            <label class="form-label">Items (comma-separated)</label>
            <input class="form-input" data-path="skills.${i}.items" data-type="csv" value="${escapeAttr(items)}" />
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Skills</h3>
          <button class="btn btn--ghost btn--sm" onclick="Editor.addArrayItem('skills', {category:'',icon:'code',items:[]})">+ Add Skill</button>
        </div>
        ${cards}
      </div>
    `;
  }

  /**
   * Render projects section editor.
   */
  function renderProjects() {
    const projects = siteData?.projects || [];
    const cards = projects.map((proj, i) => {
      const tags = (proj.tags || []).join(', ');
      return `
        <div class="array-item" data-index="${i}">
          <div class="array-item__header">
            <span class="array-item__number">#${i + 1}</span>
            <div>
              <button class="btn btn--danger btn--sm" onclick="Editor.removeArrayItem('projects', ${i})">Remove</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Title</label>
            <input class="form-input" data-path="projects.${i}.title" value="${escapeAttr(proj.title || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" data-path="projects.${i}.description" rows="2">${escapeHTML(proj.description || '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Tags (comma-separated)</label>
            <input class="form-input" data-path="projects.${i}.tags" data-type="csv" value="${escapeAttr(tags)}" />
          </div>
          <div class="form-group">
            <label class="form-label">Live Link</label>
            <input class="form-input" data-path="projects.${i}.link" value="${escapeAttr(proj.link || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">GitHub Link</label>
            <input class="form-input" data-path="projects.${i}.github" value="${escapeAttr(proj.github || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Image URL</label>
            <input class="form-input" data-path="projects.${i}.image" value="${escapeAttr(proj.image || '')}" />
          </div>
          <div class="form-group">
            <label class="form-toggle">
              <input type="checkbox" data-path="projects.${i}.featured" data-type="bool" ${proj.featured ? 'checked' : ''} />
              <span class="form-toggle__switch"></span>
              <span class="form-toggle__label">Featured</span>
            </label>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Projects</h3>
          <button class="btn btn--ghost btn--sm" onclick="Editor.addArrayItem('projects', {title:'',description:'',tags:[],link:'',github:'',image:'',featured:false})">+ Add Project</button>
        </div>
        ${cards}
      </div>
    `;
  }

  /**
   * Render experience section editor.
   */
  function renderExperience() {
    const experience = siteData?.experience || [];
    const items = experience.map((exp, i) => {
      const highlights = (exp.highlights || []).join('\n');
      return `
        <div class="array-item" data-index="${i}">
          <div class="array-item__header">
            <span class="array-item__number">#${i + 1}</span>
            <div>
              <button class="btn btn--danger btn--sm" onclick="Editor.removeArrayItem('experience', ${i})">Remove</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Role</label>
            <input class="form-input" data-path="experience.${i}.role" value="${escapeAttr(exp.role || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Company</label>
            <input class="form-input" data-path="experience.${i}.company" value="${escapeAttr(exp.company || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Period</label>
            <input class="form-input" data-path="experience.${i}.period" value="${escapeAttr(exp.period || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" data-path="experience.${i}.description" rows="2">${escapeHTML(exp.description || '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Highlights (one per line)</label>
            <textarea class="form-textarea" data-path="experience.${i}.highlights" data-type="lines" rows="4">${escapeHTML(highlights)}</textarea>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Experience</h3>
          <button class="btn btn--ghost btn--sm" onclick="Editor.addArrayItem('experience', {role:'',company:'',period:'',description:'',highlights:[]})">+ Add Experience</button>
        </div>
        ${items}
      </div>
    `;
  }

  /**
   * Render contact section editor.
   */
  function renderContact() {
    const contact = siteData?.contact || {};
    const social = (contact.social || []).map((s, i) =>
      `<div class="array-item" data-index="${i}">
        <div class="array-item__header">
          <span class="array-item__number">#${i + 1}</span>
          <button class="btn btn--danger btn--sm" onclick="Editor.removeArrayItem('contact.social', ${i})">Remove</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;">
          <div class="form-group">
            <label class="form-label">Platform</label>
            <input class="form-input" data-path="contact.social.${i}.platform" value="${escapeAttr(s.platform || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">URL</label>
            <input class="form-input" data-path="contact.social.${i}.url" value="${escapeAttr(s.url || '')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Icon</label>
            <input class="form-input" data-path="contact.social.${i}.icon" value="${escapeAttr(s.icon || '')}" />
          </div>
        </div>
      </div>`
    ).join('');

    return `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Contact</h3>
        </div>
        <div class="form-group">
          <label class="form-label">Heading</label>
          <input class="form-input" data-path="contact.heading" value="${escapeAttr(contact.heading || '')}" />
        </div>
        <div class="form-group">
          <label class="form-label">Subtext</label>
          <textarea class="form-textarea" data-path="contact.subtext" rows="2">${escapeHTML(contact.subtext || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" data-path="contact.email" value="${escapeAttr(contact.email || '')}" />
        </div>
      </div>
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Social Links</h3>
          <button class="btn btn--ghost btn--sm" onclick="Editor.addArrayItem('contact.social', {platform:'',url:'',icon:''})">+ Add Link</button>
        </div>
        ${social}
      </div>
    `;
  }

  /**
   * Render settings editor.
   */
  function renderSettings() {
    const settings = siteData?.settings || {};
    return `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Site Settings</h3>
        </div>
        <div class="form-group">
          <label class="form-label">Particle Count</label>
          <input class="form-input" type="number" data-path="settings.particleCount" data-type="number" value="${settings.particleCount || 80}" />
          <p class="form-hint">Number of background particles (20-200 recommended)</p>
        </div>
        <div class="form-group">
          <label class="form-label">Animation Speed</label>
          <input class="form-input" type="number" step="0.1" data-path="settings.animationSpeed" data-type="number" value="${settings.animationSpeed || 1.0}" />
        </div>
        <div class="form-group">
          <label class="form-label">Theme</label>
          <select class="form-select" data-path="settings.theme">
            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-toggle">
            <input type="checkbox" data-path="settings.cursorGlow" data-type="bool" ${settings.cursorGlow !== false ? 'checked' : ''} />
            <span class="form-toggle__switch"></span>
            <span class="form-toggle__label">Custom Cursor Glow</span>
          </label>
        </div>
        <div class="form-group">
          <label class="form-toggle">
            <input type="checkbox" data-path="settings.smoothScroll" data-type="bool" ${settings.smoothScroll !== false ? 'checked' : ''} />
            <span class="form-toggle__switch"></span>
            <span class="form-toggle__label">Smooth Scrolling</span>
          </label>
        </div>
      </div>
    `;
  }

  /**
   * Collect form data from the current editor view.
   */
  function collectFormData() {
    const inputs = document.querySelectorAll('[data-path]');
    inputs.forEach(input => {
      const path = input.dataset.path;
      const type = input.dataset.type;
      let value;

      if (type === 'bool') {
        value = input.checked;
      } else if (type === 'number') {
        value = parseFloat(input.value) || 0;
      } else if (type === 'csv') {
        value = input.value.split(',').map(s => s.trim()).filter(Boolean);
      } else if (type === 'lines') {
        value = input.value.split('\n').map(s => s.trim()).filter(Boolean);
      } else if (input.tagName === 'SELECT') {
        value = input.value;
      } else {
        value = input.value;
      }

      setNestedValue(siteData, path, value);
    });

    dirty = true;
    return siteData;
  }

  /**
   * Set a nested value by dot-path.
   */
  function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
      if (current[key] === undefined) {
        current[key] = isNaN(keys[i + 1]) ? {} : [];
      }
      current = current[key];
    }
    const lastKey = isNaN(keys[keys.length - 1]) ? keys[keys.length - 1] : parseInt(keys[keys.length - 1]);
    current[lastKey] = value;
  }

  /**
   * Add item to an array at a given path.
   */
  function addArrayItem(path, defaultItem) {
    collectFormData();
    const keys = path.split('.');
    let current = siteData;
    for (const key of keys) {
      const k = isNaN(key) ? key : parseInt(key);
      current = current[k];
    }
    if (Array.isArray(current)) {
      current.push(typeof defaultItem === 'object' ? JSON.parse(JSON.stringify(defaultItem)) : defaultItem);
      dirty = true;
      if (typeof AdminApp !== 'undefined') AdminApp.refreshCurrentSection();
    }
  }

  /**
   * Remove item from an array at a given path.
   */
  function removeArrayItem(path, index) {
    collectFormData();
    const keys = path.split('.');
    let current = siteData;
    for (const key of keys) {
      const k = isNaN(key) ? key : parseInt(key);
      current = current[k];
    }
    if (Array.isArray(current) && index >= 0 && index < current.length) {
      current.splice(index, 1);
      dirty = true;
      if (typeof AdminApp !== 'undefined') AdminApp.refreshCurrentSection();
    }
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return {
    setData, getData, isDirty, markDirty, markClean,
    collectFormData, addArrayItem, removeArrayItem,
    renderOverview, renderMeta, renderHero, renderAbout,
    renderSkills, renderProjects, renderExperience,
    renderContact, renderSettings,
  };
})();
