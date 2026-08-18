const { sessionToken } = require('../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const { password } = body || {};

  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    return res.status(500).json({ error: 'APP_PASSWORD não configurada no servidor. Defina essa variável de ambiente no Vercel.' });
  }
  if (!password || password !== expected) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  const token = sessionToken();
  res.setHeader('Set-Cookie', `auth=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax; Secure`);
  res.status(200).json({ ok: true });
};
