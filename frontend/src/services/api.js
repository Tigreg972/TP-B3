const API_URL = "http://localhost:8000/api";

export const api = {
  async request(endpoint, options = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    let data = null;

    try {
      data = await res.json();
    } catch {

    }

    if (!res.ok) {
      const msg =
        data?.detail ||
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : `Erreur ${res.status}`);
      throw new Error(msg);
    }
    return data;
  },

  get(ep) {
    return this.request(ep);
  },

  post(ep, body) {
    return this.request(ep, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
  },

  put(ep, body) {
    return this.request(ep, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
  },

  del(ep) {
    return this.request(ep, { method: "DELETE" });
  },
};

// alias pour compatibilité
api.delete = api.del;
