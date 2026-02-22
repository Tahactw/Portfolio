/* ══════════════════════════════════════════════
   UTILS — Shared helpers
   ══════════════════════════════════════════════ */

const Utils = (() => {
  /**
   * Throttle function calls.
   */
  function throttle(fn, delay) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  /**
   * Debounce function calls.
   */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Linear interpolation.
   */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * Clamp value between min and max.
   */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /**
   * Map a value from one range to another.
   */
  function mapRange(value, inMin, inMax, outMin, outMax) {
    return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
  }

  /**
   * Check if element is in viewport.
   */
  function isInViewport(el, threshold = 0.15) {
    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;
    return rect.top < windowH * (1 - threshold) && rect.bottom > windowH * threshold;
  }

  /**
   * Safe querySelector with error logging.
   */
  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  }

  /**
   * Fetch JSON with error handling.
   */
  async function fetchJSON(url, options = {}) {
    try {
      const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`[fetchJSON] ${url}:`, err);
      return null;
    }
  }

  /**
   * Create element with attributes.
   */
  function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (key === 'className') el.className = val;
      else if (key === 'innerHTML') el.innerHTML = val;
      else if (key === 'textContent') el.textContent = val;
      else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
      else el.setAttribute(key, val);
    }
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child) el.appendChild(child);
    });
    return el;
  }

  /**
   * Generate a unique ID.
   */
  function uid() {
    return Math.random().toString(36).slice(2, 9);
  }

  return {
    throttle, debounce, lerp, clamp, mapRange,
    isInViewport, $, $$, fetchJSON, createElement, uid,
  };
})();
