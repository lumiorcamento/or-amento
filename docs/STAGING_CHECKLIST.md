# Checklist de Staging - LumiIA

Utilize este checklist para validar o ambiente de homologação (staging) antes da liberação para produção.

## 1. Infraestrutura Supabase
- [ ] Projeto Staging criado no Supabase.
- [ ] Migrations aplicadas (`supabase db push`).
- [ ] Autenticação configurada (Email/Password).
- [ ] Site URL e Redirect URIs configurados no Auth settings.
- [ ] Secrets configurados (`supabase secrets set`).
- [ ] Todas as 9 Edge Functions deployadas.

## 2. Frontend Vercel
- [ ] Projeto importado do GitHub na Vercel.
- [ ] Variáveis `VITE_` configuradas no Environment Variables da Vercel.
- [ ] Build realizado com sucesso.
- [ ] URL de staging (ex: `lumiia-staging.vercel.app`) funcional.

## 3. Fluxo de Integração Bling
- [ ] App de testes criado no portal Bling.
- [ ] Callback URI de staging cadastrada no Bling.
- [ ] Conexão OAuth realizada com sucesso pelo painel do lojista.
- [ ] Sincronização de catálogo importando produtos reais.
- [ ] Tokens salvos e criptografados corretamente no banco.

## 4. Fluxo de Integração Nuvemshop
- [ ] App de testes criado no portal Nuvemshop.
- [ ] Callback URI de staging cadastrada na Nuvemshop.
- [ ] Conexão OAuth realizada com sucesso.
- [ ] Instalação do script de vitrine validada.
- [ ] Botão "IA" aparecendo na loja de testes da Nuvemshop.

## 5. Validação de IA e Orçamentos
- [ ] IA gerando recomendações baseadas no catálogo real.
- [ ] IA respeitando restrições de estoque e status ativo.
- [ ] Orçamento criado pelo comprador e visível no painel do lojista.
- [ ] Consentimento de personalização gravado no perfil do comprador.

## 6. Segurança e Logs
- [ ] RLS (Row Level Security) validado (um lojista não vê dados de outro).
- [ ] Logs de sincronização registrando sucessos e erros.
- [ ] Erros de Edge Function não expondo segredos no log público.
