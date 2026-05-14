# Guia de Rollback - LumiIA

Procedimentos de emergência para reverter o sistema em caso de falhas críticas em produção.

## 1. Frontend (Vercel)
A Vercel permite reversão instantânea:
1. Acesse o Dashboard do projeto na Vercel.
2. Vá na aba **Deployments**.
3. Identifique o deploy estável anterior.
4. Clique nos três pontos (...) e selecione **Instant Rollback**.

## 2. Banco de Dados
Caso uma migration tenha quebrado o banco:
1. **Migrations**: Infelizmente, `supabase db push` não tem rollback automático de schema.
2. **Procedimento**: Execute o SQL de correção manual ou restaure o backup pontual (Point-in-Time Recovery) se disponível no plano Pro do Supabase.

## 3. Edge Functions
Se uma função específica estiver falhando:
1. Re-deploye a versão anterior do código local:
   ```bash
   git checkout [commit_anterior] supabase/functions/[nome-da-função]
   supabase functions deploy [nome-da-função]
   ```

## 4. Integrações
Se o botão da Nuvemshop estiver quebrando a vitrine do cliente:
1. Desative globalmente via banco:
   ```sql
   UPDATE storefront_quote_settings SET enabled = false;
   ```
2. Ou remova o script via portal Nuvemshop.

## 5. Inteligência Artificial
Se a IA estiver gerando respostas ofensivas ou erradas:
1. Altere o `AI_PROVIDER` para um provedor de fallback ou desative a funcionalidade de sugestão automática no frontend alterando a flag de feature toggle se disponível.
