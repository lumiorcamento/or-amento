# Variáveis de Ambiente - LumiIA

Este documento descreve as variáveis de ambiente necessárias para o funcionamento do LumiIA em diferentes ambientes.

## 🚀 Frontend (Vercel)
Estas variáveis devem ter o prefixo `VITE_` para serem expostas ao código cliente.

| Variável | Descrição | Pública/Privada | Exemplo Seguro |
|----------|-----------|-----------------|----------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Pública | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima do Supabase | Pública | `eyJhbGciOiJIUzI1...` |
| `VITE_APP_URL` | URL base da aplicação frontend | Pública | `https://app.lumiia.com.br` |
| `VITE_SUPABASE_FUNCTIONS_URL` | URL base das Edge Functions | Pública | `https://xyz.supabase.co/functions/v1` |

---

## ⚡ Supabase Edge Functions (Secrets)
Estas variáveis são **segredos de servidor** e NUNCA devem ser prefixadas com `VITE_` ou expostas ao frontend.

### Inteligência Artificial
| Variável | Descrição | Onde Configurar |
|----------|-----------|-----------------|
| `AI_PROVIDER` | Provedor de IA (ex: `openai`) | Supabase Secrets |
| `AI_MODEL` | Modelo de IA (ex: `gpt-4o`) | Supabase Secrets |
| `OPENAI_API_KEY` | Chave de API da OpenAI | Supabase Secrets |

### Integração Bling
| Variável | Descrição | Onde Configurar |
|----------|-----------|-----------------|
| `BLING_CLIENT_ID` | Client ID do App no Bling | Supabase Secrets |
| `BLING_CLIENT_SECRET` | Client Secret do App no Bling | Supabase Secrets |
| `BLING_REDIRECT_URI` | URL de callback OAuth do Bling | Supabase Secrets |

### Integração Nuvemshop
| Variável | Descrição | Onde Configurar |
|----------|-----------|-----------------|
| `NUVEMSHOP_CLIENT_ID` | Client ID do App na Nuvemshop | Supabase Secrets |
| `NUVEMSHOP_CLIENT_SECRET` | Client Secret do App na Nuvemshop | Supabase Secrets |
| `NUVEMSHOP_REDIRECT_URI` | URL de callback OAuth da Nuvemshop | Supabase Secrets |
| `PUBLIC_APP_URL` | URL base pública (para scripts JS) | Supabase Secrets |

### Segurança
| Variável | Descrição | Onde Configurar |
|----------|-----------|-----------------|
| `INTEGRATION_ENCRYPTION_KEY` | Chave de 32 bytes para AES-GCM | Supabase Secrets |

---

## ⚠️ Regras Críticas de Segurança
1. **Nunca** crie variáveis como `VITE_OPENAI_API_KEY`.
2. **Nunca** salve chaves reais no arquivo `.env` que é commitado (use `.env.example`).
3. **Nunca** exponha a `SUPABASE_SERVICE_ROLE_KEY` no frontend.
4. Utilize `supabase secrets set` para configurar segredos no backend.
