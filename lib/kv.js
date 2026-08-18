function creds() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error('Banco (KV) não configurado: faltam as variáveis KV_REST_API_URL / KV_REST_API_TOKEN. Conecte um banco Redis/KV ao projeto no painel do Vercel.');
  }
  return { url, token };
}

async function kvGet(key) {
  const { url, token } = creds();
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Falha ao ler do banco (status ${res.status})`);
  const data = await res.json();
  return data.result || null;
}

async function kvSet(key, value) {
  const { url, token } = creds();
  const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' },
    body: value
  });
  if (!res.ok) throw new Error(`Falha ao gravar no banco (status ${res.status})`);
  const data = await res.json();
  return data.result === 'OK';
}

module.exports = { kvGet, kvSet };
