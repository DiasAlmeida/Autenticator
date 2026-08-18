const { isAuthed } = require('../lib/auth');
const { encrypt, decrypt } = require('../lib/crypto');
const { kvGet, kvSet } = require('../lib/kv');

const KEY = 'ninjagamer_accounts_v1';

module.exports = async (req, res) => {
  if (!isAuthed(req)) return res.status(401).json({ error: 'Não autenticado' });

  if (req.method === 'GET') {
    try {
      const raw = await kvGet(KEY);
      if (!raw) return res.status(200).json({ accounts: [] });
      const json = decrypt(raw);
      return res.status(200).json({ accounts: JSON.parse(json) });
    } catch (e) {
      return res.status(500).json({ error: 'Erro ao carregar contas', detail: String((e && e.message) || e) });
    }
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const accounts = body && body.accounts;
      if (!Array.isArray(accounts)) return res.status(400).json({ error: 'Formato inválido: esperado { accounts: [...] }' });
      const encrypted = encrypt(JSON.stringify(accounts));
      const ok = await kvSet(KEY, encrypted);
      if (!ok) return res.status(500).json({ error: 'Falha ao salvar no banco' });
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Erro ao salvar contas', detail: String((e && e.message) || e) });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
};
