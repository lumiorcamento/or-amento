# Monitoramento e Operações - LumiIA

Guia básico para monitorar a saúde do sistema LumiIA em produção.

## 1. Logs do Sistema

### Frontend (Vercel)
- Acesse o projeto na Vercel > **Logs**.
- Filtre por erros (5xx) ou lentidão.

### Backend (Supabase Edge Functions)
- Acesse o dashboard do Supabase > **Edge Functions**.
- Selecione a função (ex: `generate-recommendation`) > **Logs**.
- Útil para debugar falhas na API da OpenAI ou erros de lógica no servidor.

### Banco de Dados (Sincronização)
- Monitore a tabela `integration_sync_logs`:
  ```sql
  SELECT * FROM integration_sync_logs WHERE status = 'error' ORDER BY created_at DESC;
  ```

## 2. Métricas de Sucesso (KPIs)
Acompanhe os seguintes indicadores via SQL Editor:

- **Volume de Orçamentos**: `SELECT count(*) FROM quote_requests WHERE created_at > now() - interval '24 hours';`
- **Uso de IA**: `SELECT count(*) FROM recommendation_feedback;`
- **Lojas Ativas**: `SELECT count(*) FROM integrations WHERE status = 'connected';`

## 3. Alertas Manuais
- Fique atento a produtos com `stock_quantity = 0` que continuam aparecendo em orçamentos.
- Verifique se o `access_token` de alguma loja expirou e não foi renovado automaticamente (Logs de erro no Bling).

## 4. Troubleshooting Comum
- **Botão não aparece na Nuvemshop**: Verifique se o script está instalado e se `enabled` está `true` em `storefront_quote_settings`.
- **IA não recomenda produtos**: Verifique se os produtos estão marcados como `active = true` e se possuem tags/descrições mínimas.
