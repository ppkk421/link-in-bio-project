const DEFAULT_BASE = "http://localhost:5000";

export function getApiBase() {
  return import.meta.env.VITE_API_BASE || DEFAULT_BASE;
}

export function getToken() {
  return localStorage.getItem("libio:token") || "";
}

export function setToken(token) {
  localStorage.setItem("libio:token", token);
}

export function clearToken() {
  localStorage.removeItem("libio:token");
}

async function request(path, { method = "GET", token, json } = {}) {
  const headers = {};
  if (json !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${getApiBase()}${path}`, {
    method,
    headers,
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.error || `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export const api = {
  login(password) {
    return request("/api/login", { method: "POST", json: { password } });
  },
  getProfile() {
    return request("/api/profile");
  },
  getLinks() {
    return request("/api/links");
  },
  updateProfile(token, payload) {
    return request("/api/profile", { method: "PUT", token, json: payload });
  },
  addLink(token, payload) {
    return request("/api/links", { method: "POST", token, json: payload });
  },
  updateLink(token, id, payload) {
    return request(`/api/links/${id}`, { method: "PUT", token, json: payload });
  },
  deleteLink(token, id) {
    return request(`/api/links/${id}`, { method: "DELETE", token });
  },
};

