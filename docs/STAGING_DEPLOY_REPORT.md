# Relatório de Deploy Staging - LumiIA

**Data:** 11 de Maio de 2026
**Status:** Em Execução (Fase 10)
**Ambiente:** Staging

## 🚀 Infraestrutura
- **Supabase Project Ref:** `wubwvwrbmxtwbzcvwsws`
- **Frontend URL (Vercel):** `https://lumiai-black.vercel.app`
- **Migrations:** Aplicadas (`20260511183100_initial_lumiia_schema.sql`)
- **Edge Functions:** Todas as 9 funções deployadas com sucesso.

## 🔐 Configuração de Secrets (Supabase)
| Nome | Status |
|------|--------|
| `AI_PROVIDER` | ✅ Configurado (`openai`) |
| `AI_MODEL` | ✅ Configurado (`gpt-4o`) |
| `OPENAI_API_KEY` | ✅ Configurado |
| `INTEGRATION_ENCRYPTION_KEY` | ✅ Configurado |
| `PUBLIC_APP_URL` | ✅ Configurado |
| `BLING_REDIRECT_URI` | ✅ Configurado |
| `NUVEMSHOP_REDIRECT_URI` | ✅ Configurado |
| `BLING_CLIENT_ID` | ⚠️ Pendente |
| `BLING_CLIENT_SECRET` | ⚠️ Pendente |
| `NUVEMSHOP_CLIENT_ID` | ✅ Configurado |
| `NUVEMSHOP_CLIENT_SECRET` | ✅ Configurado |

## 🧪 Testes de Validação
- [x] **Banco de Dados**: Tabelas e RPCs criados via migration.
- [x] **Edge Functions**: Deploy confirmado via CLI.
- [ ] **Saúde do Frontend**: Aguardando deploy na Vercel.
- [ ] **Fluxo de IA**: Aguardando teste no frontend.
- [ ] **Integração Bling**: Pendente (aguardando chaves).
- [ ] **Integração Nuvemshop**: Pendente (aguardando chaves).

## ⚠️ Pendências e Riscos
1. Configurar variáveis `VITE_*` no painel da Vercel.
2. Criar Apps de Staging no Bling e Nuvemshop para testar fluxos de conexão.
3. Validar fluxo de redirecionamento do script da vitrine no domínio real.
