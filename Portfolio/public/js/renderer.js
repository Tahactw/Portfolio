/* ══════════════════════════════════════════════
   RENDERER — Game UI HTML builder
   Terminal typing, HUD panels, achievement cards
   ══════════════════════════════════════════════ */

const Renderer = (() => {
  let siteData = null;

  async function init() {
    siteData = await Utils.fetchJSON('/api/site');
    if (!siteData) {
      console.error('[Renderer] Failed to load site data');
      document.getElementById('content').innerHTML =
        '<div style="text-align:center;padding:4rem;color:#6a6a80;font-family:var(--f-mono);">> ERROR: Failed to load site data.</div>';
      return null;
    }

    // Update meta
    if (siteData.meta) {
      document.title = siteData.meta.title || 'Portfolio';
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute('content', siteData.meta.description || '');
    }

    // Render all sections
    const content = document.getElementById('content');
    if (!content) return siteData;

    content.innerHTML = [
      renderHero(siteData.hero),
      renderAbout(siteData.about),
      renderSkills(siteData.skills),
      renderProjects(siteData.projects),
      renderExperience(siteData.experience),
      renderContact(siteData.contact),
    ].join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
    return siteData;
  }

  /* ── Hero — Game Title Screen ───────────── */
  function renderHero(data) {
    if (!data) return '';
    const ctaHTML = data.cta
      ? `<button type="button" class="hero__cta magnetic" onclick="Scroll.goTo(3)">
           <span>${esc(data.cta.text || 'View My Work')}</span>
           <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
         </button>`
      : '';

    return `
      <section class="section hero" id="hero">
        <div class="hero__content">
          <p class="hero__greeting" data-type="${esc(data.greeting || 'Hi, I\'m')}" data-type-speed="60"></p>
          <h1 class="hero__name" id="heroName">
            <span class="typed-text" data-type="${esc(data.name || '')}" data-type-speed="80" data-type-delay="800"></span><span class="typed-cursor"></span>
          </h1>
          <p class="hero__tagline" data-type="${esc(data.tagline || '')}" data-type-speed="20" data-type-delay="2200"></p>
          ${ctaHTML}
        </div>
        <div class="hero__scroll-indicator">
          <span>Scroll</span>
          <div class="hero__scroll-line"></div>
        </div>
        <div class="hero__status">
          <span class="status-dot"></span>SYSTEM ONLINE — v2.0
        </div>
      </section>
    `;
  }

  /* ── About — Player Profile ─────────────── */
  function renderAbout(data) {
    if (!data) return '';
    const paragraphs = (data.paragraphs || []).map(p => `<p>${esc(p)}</p>`).join('');
    const imageHTML = data.image
      ? `<img src="${esc(convertImageUrl(data.image))}" alt="Profile" style="width:100%;height:100%;object-fit:cover;" />`
      : '<div class="about__image-placeholder"><i data-lucide="user" style="width:48px;height:48px;color:rgba(0,212,255,0.2);"></i></div>';

    return `
      <section class="section" id="about">
        <div class="about-section">
          <div class="container">
            <div class="section__header reveal">
              <span class="section__label">PLAYER_PROFILE</span>
              <h2 class="section__title"><span class="gradient-text">${esc(data.heading || 'About Me')}</span></h2>
              <div class="section__divider"></div>
            </div>
            <div class="about__grid">
              <div class="about__image-wrapper reveal">${imageHTML}</div>
              <div class="about__info reveal">
                <div class="panel">
                  <div class="panel__header">
                    <span class="panel__header-dot"></span>
                    BIO_DATA
                  </div>
                  <div class="about__bio">${paragraphs}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /* ── Skills — Ability Tree / XP Bars ─────── */
  function renderSkills(data) {
    if (!data || !data.length) return '';
    const iconMap = {
      shield: 'shield', code: 'code-2', layers: 'layers',
      terminal: 'terminal', database: 'database', globe: 'globe',
      server: 'server', lock: 'lock', cpu: 'cpu',
      clapperboard: 'clapperboard', pen_tool: 'pen-tool',
      film: 'film', box: 'box', monitor: 'monitor', star: 'star',
    };

    const panels = data.map(skill => {
      const iconName = iconMap[skill.icon] || 'star';
      const items = (skill.items || []).map((item, idx) => {
        // Generate pseudo-random fill based on item name length
        const fill = 55 + ((item.length * 7 + idx * 13) % 40);
        return `
          <div class="skill-item">
            <span class="skill-item__name">${esc(item)}</span>
            <div class="skill-item__bar">
              <div class="skill-item__bar-fill" style="--fill: ${fill}%"></div>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="skill-panel reveal">
          <div class="skill-panel__header">
            <div class="skill-panel__icon">
              <i data-lucide="${iconName}" style="width:18px;height:18px;"></i>
            </div>
            <span class="skill-panel__title">${esc(skill.category || '')}</span>
          </div>
          <div class="skill-panel__items">${items}</div>
        </div>
      `;
    }).join('');

    return `
      <section class="section" id="skills">
        <div class="skills-section">
          <div class="container">
            <div class="section__header reveal">
              <span class="section__label">ABILITY_TREE</span>
              <h2 class="section__title"><span class="gradient-text">Skills &amp; Tools</span></h2>
              <div class="section__divider"></div>
            </div>
            <div class="grid grid--2 stagger">${panels}</div>
          </div>
        </div>
      </section>
    `;
  }

  /* ── Projects — Achievement Cards ────────── */
  function renderProjects(data) {
    if (!data) return '';
    const projects = data.filter(p => p.title && p.title.trim());
    if (!projects.length) return '';

    const cards = projects.map((project, idx) => {
      const tags = (project.tags || []).map(t => `<span class="skill-tag">${esc(t)}</span>`).join('');
      const badge = project.featured
        ? '<span class="project-card__badge">★ Featured</span>'
        : '';

      let imgHTML = '';
      const thumbUrl = getProjectThumb(project);
      if (thumbUrl) {
        imgHTML = `<img src="${esc(thumbUrl)}" alt="${esc(project.title)}" loading="lazy" />`;
      }

      return `
        <div class="project-card reveal" data-project-index="${idx}" onclick="Renderer.openProjectModal(${idx})">
          <div class="project-card__image">
            ${imgHTML}
            ${!imgHTML ? '<div class="project-card__image-gradient"></div>' : ''}
            <div class="project-card__overlay">
              <span class="project-card__overlay-text">[ Inspect ]</span>
            </div>
          </div>
          <div class="project-card__body">
            <h3 class="project-card__title">${esc(project.title)}${badge}</h3>
            <p class="project-card__desc">${esc(project.description || '')}</p>
            <div class="project-card__tags">${tags}</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="section" id="projects">
        <div class="projects-section">
          <div class="container">
            <div class="section__header reveal">
              <span class="section__label">ACHIEVEMENTS</span>
              <h2 class="section__title"><span class="gradient-text">Featured Work</span></h2>
              <div class="section__divider"></div>
            </div>
            <div class="projects-grid stagger">${cards}</div>
          </div>
        </div>
      </section>
    `;
  }

  /* ── Experience — Quest Log ─────────────── */
  function renderExperience(data) {
    if (!data || !data.length) return '';
    const items = data.map((exp, i) => {
      const highlights = (exp.highlights || []).map(h =>
        `<li class="timeline__highlight">${esc(h)}</li>`
      ).join('');

      return `
        <div class="timeline__item reveal">
          <div class="timeline__dot"></div>
          <div class="timeline__card">
            <div class="timeline__quest-label">
              <i data-lucide="swords" style="width:10px;height:10px;"></i>
              QUEST ${String(i + 1).padStart(2, '0')} — COMPLETED
            </div>
            <h3 class="timeline__role">${esc(exp.role || '')}</h3>
            <p class="timeline__company">${esc(exp.company || '')}</p>
            <p class="timeline__period">${esc(exp.period || '')}</p>
            <p class="timeline__description">${esc(exp.description || '')}</p>
            ${highlights ? `<ul class="timeline__highlights">${highlights}</ul>` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <section class="section" id="experience">
        <div class="experience-section">
          <div class="container">
            <div class="section__header reveal">
              <span class="section__label">QUEST_LOG</span>
              <h2 class="section__title"><span class="gradient-text">Experience</span></h2>
              <div class="section__divider"></div>
            </div>
            <div class="timeline">${items}</div>
          </div>
        </div>
      </section>
    `;
  }

  /* ── Contact — Terminal Connect ──────────── */
  function renderContact(data) {
    if (!data) return '';
    const socialLinks = (data.social || []).map(s => {
      const iconName = s.icon || s.platform.toLowerCase();
      return `<a href="${esc(s.url || '#')}" target="_blank" rel="noopener" class="contact__social-link magnetic" title="${esc(s.platform || '')}">
        <i data-lucide="${esc(iconName)}" style="width:18px;height:18px;"></i>
      </a>`;
    }).join('');

    const emailLink = data.email
      ? `<a href="mailto:${esc(data.email)}" class="contact__email magnetic">
           <i data-lucide="terminal" style="width:14px;height:14px;"></i>
           ${esc(data.email)}
         </a>` : '';

    const year = new Date().getFullYear();

    return `
      <section class="section" id="contact">
        <div class="contact-section">
          <div class="contact__wrapper">
            <div class="container">
              <div class="section__header reveal" style="text-align:center;">
                <span class="section__label" style="justify-content:center;">ESTABLISH_CONNECTION</span>
                <h2 class="section__title" style="text-align:center;"><span class="gradient-text">${esc(data.heading || 'Get In Touch')}</span></h2>
                <div class="section__divider" style="margin-left:auto;margin-right:auto;"></div>
              </div>
              <div class="contact__content reveal">
                <p class="contact__text">${esc(data.subtext || '')}</p>
                ${emailLink}
                <div class="contact__social">${socialLinks}</div>
              </div>
            </div>
          </div>
          <footer class="footer">
            <div class="container">
              <p class="footer__text">&copy; ${year} &middot; System built with intention</p>
            </div>
          </footer>
        </div>
      </section>
    `;
  }

  /* ════════════════════════════════════════════
     PROJECT MODAL
     ════════════════════════════════════════════ */
  function getProjects() {
    return (siteData?.projects || []).filter(p => p.title && p.title.trim());
  }

  function openProjectModal(idx) {
    const projects = getProjects();
    const project = projects[idx];
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const body = document.getElementById('projectModalBody');

    // Collect images
    const images = [];
    if (project.image) {
      const url = convertImageUrl(project.image);
      if (url) images.push(url);
    }
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach(img => {
        const url = convertImageUrl(img);
        if (url && !images.includes(url)) images.push(url);
      });
    }

    const youtubeId = getYoutubeId(project.youtube);
    const hasVideo = !!youtubeId;
    const hasModel = !!project.modelUrl;
    const hasImages = images.length > 0;

    // Tabs
    const tabs = [];
    if (hasImages) tabs.push({ key: 'gallery', label: 'Gallery' });
    if (hasVideo) tabs.push({ key: 'video', label: 'Video' });
    if (hasModel) tabs.push({ key: 'model', label: '3D Model' });

    const firstTab = tabs[0]?.key || '';
    const tabsHTML = tabs.length > 1
      ? `<div class="modal__tabs">${tabs.map((t, i) =>
        `<button class="modal__tab${i === 0 ? ' active' : ''}" data-tab="${t.key}">${t.label}</button>`
      ).join('')}</div>` : '';

    const galleryHTML = hasImages ? `
      <div class="modal__pane${firstTab === 'gallery' ? ' active' : ''}" data-pane="gallery">
        <img class="modal__main-img" src="${images[0]}" alt="" id="modalMainImg" />
        ${images.length > 1 ? `<div class="modal__thumbs">${images.map((img, i) =>
      `<img src="${img}" alt="" class="modal__thumb${i === 0 ? ' active' : ''}" />`
    ).join('')}</div>` : ''}
      </div>` : '';

    const videoHTML = hasVideo ? `
      <div class="modal__pane${!hasImages && firstTab === 'video' ? ' active' : ''}" data-pane="video">
        <div class="modal__video">
          <iframe src="https://www.youtube.com/embed/${youtubeId}" allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        </div>
      </div>` : '';

    const modelHTML = hasModel ? `
      <div class="modal__pane${!hasImages && !hasVideo && firstTab === 'model' ? ' active' : ''}" data-pane="model">
        <div class="modal__embed">
          <iframe src="${esc(project.modelUrl)}" allowfullscreen></iframe>
        </div>
      </div>` : '';

    const placeholderHTML = (!hasImages && !hasVideo && !hasModel)
      ? '<div style="padding:3rem;text-align:center;color:var(--c-text-muted);font-family:var(--f-mono);font-size:0.8rem;">> NO_MEDIA_AVAILABLE</div>'
      : '';

    const tags = (project.tags || []).map(t => `<span class="skill-tag">${esc(t)}</span>`).join('');

    const links = [];
    if (project.link) links.push(`<a href="${esc(project.link)}" target="_blank" rel="noopener" class="modal__link modal__link--primary"><i data-lucide="external-link" style="width:14px;height:14px;"></i>Live Demo</a>`);
    if (project.github) links.push(`<a href="${esc(project.github)}" target="_blank" rel="noopener" class="modal__link modal__link--secondary"><i data-lucide="github" style="width:14px;height:14px;"></i>Source</a>`);

    body.innerHTML = `
      <div class="modal__media">
        ${tabsHTML}
        ${galleryHTML}
        ${videoHTML}
        ${modelHTML}
        ${placeholderHTML}
      </div>
      <div class="modal__info">
        <h2 class="modal__title">${esc(project.title)}</h2>
        <p class="modal__desc">${esc(project.description || '')}</p>
        ${tags ? `<div class="modal__tags">${tags}</div>` : ''}
        ${links.length ? `<div class="modal__links">${links.join('')}</div>` : ''}
      </div>
    `;

    // Wire tabs
    body.querySelectorAll('.modal__tab').forEach(tab => {
      tab.addEventListener('click', () => {
        body.querySelectorAll('.modal__tab').forEach(t => t.classList.remove('active'));
        body.querySelectorAll('.modal__pane').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const pane = body.querySelector(`.modal__pane[data-pane="${tab.dataset.tab}"]`);
        if (pane) pane.classList.add('active');
      });
    });

    // Wire thumbnails
    body.querySelectorAll('.modal__thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        body.querySelectorAll('.modal__thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const mainImg = body.querySelector('#modalMainImg');
        if (mainImg) mainImg.src = thumb.src;
      });
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Utilities ───────────────────────────── */
  function getProjectThumb(project) {
    if (project.image) return convertImageUrl(project.image);
    if (project.images && project.images.length) return convertImageUrl(project.images[0]);
    return '';
  }

  function convertImageUrl(url) {
    if (!url) return '';
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return 'https://drive.google.com/thumbnail?id=' + driveMatch[1] + '&sz=w1000';
    }
    return url;
  }

  function getYoutubeId(url) {
    if (!url) return '';
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : '';
  }

  function esc(str) {
    if (typeof str !== 'string') return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function getData() { return siteData; }

  return { init, getData, openProjectModal, closeProjectModal };
})();
