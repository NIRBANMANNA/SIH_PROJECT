// src/lib/api.js
// Use the Vite proxy (/api → http://localhost:8001) during dev.
// VITE_API_URL can be set for production deployments.
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : '/api';

export async function fetchDownscaledForecast(block, panchayat, date) {
  const res = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ block, panchayat, date })
  });
  if (!res.ok) throw new Error('Forecast failed');
  return res.json();
}

export async function fetchAccuracyMetrics() {
  const res = await fetch(`${API_URL}/accuracy`);
  if (!res.ok) throw new Error('Accuracy fetch failed');
  return res.json();
}