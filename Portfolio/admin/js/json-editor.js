/* ══════════════════════════════════════════════
   JSON-EDITOR — Raw JSON editing view
   ══════════════════════════════════════════════ */

const JsonEditor = (() => {
  function render() {
    const data = Editor.getData();
    const json = JSON.stringify(data, null, 2);

    return `
      <div class="admin-card">
        <div class="admin-card__header">
          <h3 class="admin-card__title">Raw JSON Editor</h3>
          <div class="admin-card__actions">
            <button class="btn btn--ghost btn--sm" onclick="JsonEditor.format()">Format</button>
            <button class="btn btn--ghost btn--sm" onclick="JsonEditor.copyToClipboard()">Copy</button>
          </div>
        </div>
        <textarea class="json-editor" id="jsonEditorTextarea">${escapeHTML(json)}</textarea>
        <p class="form-hint" style="margin-top:0.5rem;" id="jsonStatus">Edit the JSON above and save to apply changes.</p>
      </div>
    `;
  }

  function collectData() {
    const textarea = document.getElementById('jsonEditorTextarea');
    const status = document.getElementById('jsonStatus');
    if (!textarea) return null;

    try {
      const parsed = JSON.parse(textarea.value);
      if (status) {
        status.textContent = 'Valid JSON ✓';
        status.style.color = 'var(--c-success)';
      }
      Editor.setData(parsed);
      Editor.markDirty();
      return parsed;
    } catch (err) {
      if (status) {
        status.textContent = `Invalid JSON: ${err.message}`;
        status.style.color = 'var(--c-danger)';
      }
      return null;
    }
  }

  function format() {
    const textarea = document.getElementById('jsonEditorTextarea');
    if (!textarea) return;
    try {
      const parsed = JSON.parse(textarea.value);
      textarea.value = JSON.stringify(parsed, null, 2);
    } catch {}
  }

  function copyToClipboard() {
    const textarea = document.getElementById('jsonEditorTextarea');
    if (!textarea) return;
    navigator.clipboard.writeText(textarea.value).then(() => {
      AdminApp.showToast('Copied to clipboard', 'success');
    });
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return { render, collectData, format, copyToClipboard };
})();
