const crypto = require('crypto');

function sessionToken() {
  const pass = process.env.APP_PASSWORD || '';
  return crypto.createHash('sha256').update('ninjagamer-autenticador:' + pass).digest('hex');
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  });
  return out;
}

function isAuthed(req) {
  if (!process.env.APP_PASSWORD) return false;
  const cookies = parseCookies(req.headers.cookie);
  return cookies.auth === sessionToken();
}

module.exports = { sessionToken, isAuthed };
