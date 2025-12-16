const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

// PUBLIC_INTERFACE
export async function fetchJSON(url, options = {}) {
  /** Fetch helper with JSON handling and basic error propagation. */
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // keep raw text if not JSON
    data = text;
  }
  if (!res.ok) {
    const err = new Error((data && (data.detail || data.message)) || `Request failed: ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export const NotesAPI = {
  /** List notes (GET /notes) */
  async list() {
    return fetchJSON(`${API_BASE}/notes`);
  },
  /** Get one note by id (GET /notes/{id}) */
  async get(id) {
    return fetchJSON(`${API_BASE}/notes/${id}`);
  },
  /** Create note (POST /notes) with {title, content} */
  async create(payload) {
    return fetchJSON(`${API_BASE}/notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  /** Update note (PUT /notes/{id}) with {title, content} */
  async update(id, payload) {
    return fetchJSON(`${API_BASE}/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  /** Delete note (DELETE /notes/{id}) */
  async remove(id) {
    return fetchJSON(`${API_BASE}/notes/${id}`, {
      method: 'DELETE',
    });
  },
};
