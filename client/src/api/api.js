const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export async function listLinks() {
  const res = await fetch(`${BASE}/api/links`);
  return res.json();
}
export async function getLink(code) {
  const res = await fetch(`${BASE}/api/links/${code}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}
export async function createLink(payload) {
  const res = await fetch(`${BASE}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res;
}
export async function deleteLink(code) {
  return fetch(`${BASE}/api/links/${code}`, { method: 'DELETE' });
}
