# Autenticador Ninja Gamer

App interno (estilo Google Authenticator) para gerar códigos TOTP de contas PSN e guardar os códigos de backup. Protegido por senha compartilhada; secrets ficam criptografados no banco.

## Passo a passo do deploy

### 1. Subir o código pro GitHub
1. Crie um repositório novo no GitHub (ex: `ninjagamer-autenticador`), **privado**.
2. Dentro desta pasta, rode:
   ```
   git init
   git add .
   git commit -m "primeira versão"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/ninjagamer-autenticador.git
   git push -u origin main
   ```

### 2. Criar conta no Vercel
1. Acesse https://vercel.com/signup e entre com **"Continue with GitHub"** (usa a mesma conta do GitHub, sem precisar criar senha nova).
2. No dashboard, clique em **"Add New" → "Project"**.
3. Selecione o repositório `ninjagamer-autenticador` e clique em **"Import"**.
4. Em "Framework Preset" deixe como **"Other"** — não precisa configurar build command nem output directory, o projeto não usa framework.
5. **Antes de clicar em Deploy**, configure as variáveis de ambiente (próximo passo).

### 3. Criar o banco (Vercel KV / Redis)
1. Ainda na tela do projeto, vá em **Storage → Create Database → KV (Redis)** (na Vercel pode aparecer como "Redis" via Upstash, é o mesmo produto).
2. Dê um nome, crie, e conecte ao projeto `ninjagamer-autenticador` quando perguntado.
3. Isso preenche automaticamente as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN` no projeto — você não precisa copiar nada manualmente.
4. Plano gratuito (Hobby) cobre bem esse uso — é só um punhado de contas, poucas leituras/escritas por dia.

### 4. Configurar as outras variáveis de ambiente
Em **Project Settings → Environment Variables**, adicione:

| Nome | Valor | Como gerar |
|---|---|---|
| `APP_PASSWORD` | a senha que a equipe vai usar pra entrar no app | escolha você mesmo, algo forte |
| `ENCRYPTION_KEY` | uma chave de 64 caracteres hexadecimais (32 bytes) | rode `openssl rand -hex 32` no terminal (Mac/Linux) ou peça pra mim gerar uma |

Marque as duas para os ambientes **Production**, **Preview** e **Development**.

### 5. Deploy
Clique em **Deploy**. Em ~1 minuto o Vercel te dá uma URL tipo `https://ninjagamer-autenticador.vercel.app`.

Abra a URL, digite a `APP_PASSWORD` que você configurou, e pronto — pode compartilhar essa URL e a senha com quem precisar acessar.

### Atualizações futuras
Qualquer alteração: só dar `git push` de novo pro `main` que o Vercel republica automaticamente.

## Segurança
- Os secrets TOTP e códigos de backup ficam **criptografados** (AES-256-GCM) no banco — mesmo quem tiver acesso direto ao banco não vê em texto puro sem a `ENCRYPTION_KEY`.
- O acesso ao site é protegido por senha única compartilhada (cookie httpOnly, 30 dias).
- **Troque a `APP_PASSWORD`** se alguém sair da equipe ou desconfiar de vazamento.
- Guarde a `ENCRYPTION_KEY` em local seguro — se perdê-la, os dados salvos no banco não podem ser recuperados (nem por mim, nem pela Vercel).
