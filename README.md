# Lumi Quotes - Orçamento Personalizado com IA

Sistema de orçamento personalizado com IA para clientes de lojas online, focado em simplicidade e personalização baseada em histórico.

## 🚀 Tecnologias

- **Frontend**: Vite + React 18
- **Estilização**: Tailwind CSS + Lucide React + Framer Motion
- **Banco de Dados & Auth**: Supabase
- **Deploy**: Vercel

---

## ⚙️ Configuração Local

### 1. Pré-requisitos
- Node.js instalado
- Conta no Supabase
- Conta no Bling (para integração de catálogo)

### 2. Instalação
```bash
npm install
```

### 3. Configuração do Supabase
1. Crie um novo projeto no [Supabase](https://supabase.com/).
2. Vá em **Project Settings > API** e copie a `Project URL` e a `anon key`.
3. Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base):
   ```env
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_key_aqui
   ```
4. No Supabase, vá em **SQL Editor** e execute o conteúdo do arquivo `supabase/schema.sql` para criar as tabelas e políticas de segurança (RLS).
5. (Opcional) Execute o conteúdo de `supabase/seed_demo.sql` para popular a loja de demonstração.

### 4. IA Real e Edge Functions (Fase 6)
O sistema utiliza IA real para gerar as recomendações de produtos. Por segurança, a IA nunca é chamada pelo frontend.

1. Instale o [Supabase CLI](https://supabase.com/docs/guides/cli).
2. Configure as Secrets no Supabase (não use `VITE_` prefix no frontend):
   ```bash
   supabase secrets set OPENAI_API_KEY=sua_chave_aqui
   supabase secrets set AI_PROVIDER=openai
   supabase secrets set AI_MODEL=gpt-4o
   ```
3. No arquivo `.env` do frontend, adicione a URL base das funções:
   ```env
   VITE_SUPABASE_FUNCTIONS_URL=https://[seu-projeto].supabase.co/functions/v1
   ```
4. Faça o deploy da Edge Function:
   ```bash
   supabase functions deploy generate-recommendation
   ```

### 5. Integração Bling (Fase 7)
Automatize o catálogo sincronizando produtos do Bling.

1. Crie um aplicativo no [Bling Developers](https://developer.bling.com.br/) (API v3).
2. Configure o Redirect URI para: `http://localhost:5173/lojista/conectar/bling/callback` (ajuste para produção).
3. Configure as Secrets no Supabase:
   ```bash
   supabase secrets set BLING_CLIENT_ID=...
   supabase secrets set BLING_CLIENT_SECRET=...
   supabase secrets set BLING_REDIRECT_URI=...
   supabase secrets set INTEGRATION_ENCRYPTION_KEY=... # Chave aleatória para criptografia de tokens
   ```
4. Faça o deploy das Edge Functions:
   ```bash
   supabase functions deploy bling-oauth-callback
   supabase functions deploy bling-sync-products
   supabase functions deploy bling-disconnect
   ```

### 6. Rodar o projeto
```bash
npm run dev
```

---

## 🌍 Deploy na Vercel

1. Importe o repositório no dashboard da [Vercel](https://vercel.com/).
2. Adicione as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) nas configurações do projeto na Vercel.
3. A Vercel detectará automaticamente as configurações do Vite e fará o deploy.

---

## 🛠️ Comandos Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Cria o bundle de produção na pasta `dist`.
- `npm run lint`: Verifica erros de linting.
- `npm run preview`: Visualiza o build de produção localmente.

---

## 📝 Regras de Negócio e UX

- **Comprador**: Usuário principal. Experiência mobile-first, sem sidebar, focada no assistente.
- **Lojista**: Painel administrativo para gerir solicitações e produtos.
- **Histórico**: O histórico do comprador é segmentado por loja (`store_id`).
- **Privacidade**: RLS (Row Level Security) garante que cada usuário acesse apenas seus dados.
