/* ══════════════════════════════════════════════
   PREVIEW — Open portfolio in new tab
   ══════════════════════════════════════════════ */

const Preview = (() => {
  function init() {
    const btn = document.getElementById('previewBtn');
    if (btn) {
      btn.addEventListener('click', openPreview);
    }
  }

  function openPreview() {
    window.open('/', '_blank');
  }

  return { init };
})();
