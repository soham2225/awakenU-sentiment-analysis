const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/api/summary`);
  if (!res.ok) throw new Error('Failed to load summary');
  return res.json();
}

export async function fetchFeedback(limit = 200) {
  const res = await fetch(`${API_BASE}/api/feedback?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to load feedback');
  return res.json();
}

export async function fetchAlerts() {
  const res = await fetch(`${API_BASE}/api/alerts`);
  if (!res.ok) throw new Error('Failed to load alerts');
  return res.json();
}
