/* ══════════════════════════════════════════════
   API-CLIENT — HTTP wrapper for admin API
   ══════════════════════════════════════════════ */

const ApiClient = (() => {
  let token = '';

  function setToken(t) {
    token = t;
  }

  function getToken() {
    return token;
  }

  async function request(method, url, body = null) {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }
    return data;
  }

  async function getSite() {
    return request('GET', '/api/admin/site');
  }

  async function updateSite(data) {
    return request('PUT', '/api/admin/site', data);
  }

  async function updateSection(section, data) {
    return request('PUT', `/api/admin/site/${section}`, data);
  }

  async function reorderSection(section, order) {
    return request('POST', `/api/admin/site/${section}/reorder`, order);
  }

  /**
   * Test if current token is valid.
   */
  async function testAuth() {
    try {
      await getSite();
      return true;
    } catch {
      return false;
    }
  }

  return { setToken, getToken, getSite, updateSite, updateSection, reorderSection, testAuth };
})();
