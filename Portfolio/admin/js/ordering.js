/* ══════════════════════════════════════════════
   ORDERING — Drag-and-drop reordering (simple)
   ══════════════════════════════════════════════ */

const Ordering = (() => {
  let dragItem = null;
  let placeholder = null;

  function init() {
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDrop);
    document.addEventListener('dragend', onDragEnd);
  }

  function onDragStart(e) {
    const item = e.target.closest('.array-item[draggable]');
    if (!item) return;
    dragItem = item;
    item.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragOver(e) {
    e.preventDefault();
    const item = e.target.closest('.array-item[draggable]');
    if (!item || item === dragItem) return;

    const parent = item.parentNode;
    const rect = item.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;

    if (e.clientY < mid) {
      parent.insertBefore(dragItem, item);
    } else {
      parent.insertBefore(dragItem, item.nextSibling);
    }
  }

  function onDrop(e) {
    e.preventDefault();
  }

  function onDragEnd(e) {
    if (dragItem) {
      dragItem.style.opacity = '1';
      dragItem = null;
    }
  }

  return { init };
})();
