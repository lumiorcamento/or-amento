# Checklist de Lançamento em Produção (LumiIA)

Procedimentos obrigatórios para o deploy final em produção.

## 🔴 Pré-requisitos
- [ ] Staging validado e aprovado.
- [ ] Backup do banco de dados atual (se houver).
- [ ] Chaves de API de produção (OpenAI, Bling, Nuvemshop) em mãos.

## 🛠️ Passo a Passo do Deploy

### Fase 1: Banco e Backend
1. [ ] Vincular CLI ao projeto de produção: `supabase link --project-ref [REF]`.
2. [ ] Aplicar migrations: `supabase db push`.
3. [ ] Configurar Secrets de produção:
   - `OPENAI_API_KEY`
   - `BLING_CLIENT_SECRET`
   - `NUVEMSHOP_CLIENT_SECRET`
   - `INTEGRATION_ENCRYPTION_KEY` (Gere uma nova exclusiva para prod).
4. [ ] Deploy das Edge Functions.

### Fase 2: Frontend
1. [ ] Configurar Domínio Customizado na Vercel (ex: `app.lumiia.com.br`).
2. [ ] Atualizar variáveis de ambiente na Vercel.
3. [ ] Deploy da branch `main` ou `production`.

### Fase 3: Integrações Externas
1. [ ] Atualizar Redirect URIs nos portais de desenvolvedor (Bling/Nuvemshop).
2. [ ] Testar conexão da primeira loja real.

## ✅ Validação Final (Sanity Check)
- [ ] Comprador consegue fazer login?
- [ ] Orçamento com IA gerado em menos de 10s?
- [ ] Webhook/Script Nuvemshop funcionando no domínio real?
- [ ] Logs de erro vazios?

## 🔙 Plano de Rollback
1. Reverter deploy na Vercel para a versão estável anterior.
2. Desativar integrações via painel admin se necessário.
3. Consultar `docs/ROLLBACK.md`.
