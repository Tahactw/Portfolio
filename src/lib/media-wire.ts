/**
 * Wires the lazy media blocks that ProjectArticle renders. Used by both the
 * public project page and the admin preview, so behaviour is identical.
 *
 * 3D models load only on request — the viewer (~300 KB) is a separate chunk
 * that never touches pages without models, and never loads before a tap.
 */

export function wireModelViewers(root: ParentNode = document): void {
  const hosts = root.querySelectorAll<HTMLElement>('[data-model-host]:not([data-wired])');
  for (const host of hosts) {
    host.dataset.wired = '1';
    const btn = host.querySelector<HTMLButtonElement>('[data-load-model]');
    if (!btn) continue;
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.textContent = 'Loading viewer…';
      try {
        await import('@google/model-viewer');
        const mv = document.createElement('model-viewer');
        mv.setAttribute('src', host.dataset.src ?? '');
        mv.setAttribute('alt', host.dataset.alt ?? '3D model');
        // the viewer frames the model from its bounding box, so wrongly
        // scaled or off-origin exports still land centred in the slot
        mv.setAttribute('camera-controls', '');
        mv.setAttribute('touch-action', 'pan-y');
        mv.setAttribute('shadow-intensity', '0.6');
        mv.setAttribute('exposure', '0.9');
        mv.setAttribute('interaction-prompt', 'none');
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          // procedural idle: a supplied model is never left frozen
          mv.setAttribute('auto-rotate', '');
          mv.setAttribute('rotation-per-second', '7deg');
          mv.setAttribute('auto-rotate-delay', '1500');
        }
        if (host.dataset.poster) mv.setAttribute('poster', host.dataset.poster);
        mv.className = 'model-viewer-el';
        host.replaceChildren(mv);
      } catch {
        btn.disabled = false;
        btn.textContent = 'The viewer failed to load — tap to power on again';
      }
    });
  }
}

export function wireVideos(root: ParentNode = document): void {
  const hosts = root.querySelectorAll<HTMLElement>('[data-video-host]:not([data-wired])');
  for (const host of hosts) {
    host.dataset.wired = '1';
    const btn = host.querySelector<HTMLButtonElement>('[data-load-video]');
    if (!btn) continue;
    btn.addEventListener('click', () => {
      const provider = host.dataset.provider;
      const id = host.dataset.vid ?? '';
      const src =
        provider === 'vimeo'
          ? `https://player.vimeo.com/video/${encodeURIComponent(id)}`
          : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1`;
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = host.dataset.label ?? 'Video';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.className = 'video-iframe';
      host.replaceChildren(iframe);
    });
  }
}

export function wireProjectMedia(root: ParentNode = document): void {
  wireModelViewers(root);
  wireVideos(root);
}
