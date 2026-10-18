// Shared helpers for the Pages Functions in functions/api.
export const ALLOWED = ['https://gambitschool.com', 'https://www.gambitschool.com', 'https://ayratmak.github.io', 'http://localhost:4817', 'http://localhost:8000'];

export function cors(request, methods = 'POST, OPTIONS') {
  const origin = request.headers.get('Origin') || '';
  const h = { 'Content-Type': 'application/json', 'Vary': 'Origin' };
  if (ALLOWED.includes(origin) || /^https:\/\/[a-z0-9-]+\.gambit-7w4\.pages\.dev$/.test(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Methods'] = methods;
    h['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  return h;
}
export const reply = (request, status, body, methods) => new Response(JSON.stringify(body), { status, headers: cors(request, methods) });
export const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
