const API_URL = "http://127.0.0.1:8000/api"; // ← adresse Django par défaut (127.0.0.1 plutôt que localhost)

export const api = {
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_URL}${endpoint}`;
    const res = await fetch(url, options);

    let data = null;
    try {
      data = await res.json();
    } catch {
      // pas grave si pas de JSON (ex: DELETE sans contenu)
    }

    if (!res.ok) {
      const msg =
        data?.detail ||
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : `Erreur ${res.status}`);
      console.error("API error:", msg, data);
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

// Alias pratique
api.delete = api.del;
