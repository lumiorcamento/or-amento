# Auditoria Geral do Projeto: LumiIA
**Versão:** 1.0 (Pós-Fase 10)
**Data:** 14 de Maio de 2026

## 1. Visão Geral
O LumiIA é uma plataforma de orçamentos assistidos por IA, projetada para converter consultas de clientes em sugestões de compra personalizadas e estruturadas. O sistema atua como uma ponte entre lojas (Nuvemshop/Bling) e compradores finais.

---

## 2. O que o projeto FAZ (Funcionalidades)

### 🤖 Inteligência Artificial (Motor de Recomendação)
- **Sugestões Reais**: Recebe o pedido em linguagem natural e cruza com o catálogo real da loja.
- **Justificativa Consultiva**: A IA explica por que cada produto foi sugerido.
- **Prevenção de Alucinação**: Regras rígidas impedem a IA de inventar produtos; ela só trabalha com o que está no banco.
- **Segurança Server-side**: Toda a lógica de IA roda em Supabase Edge Functions (OpenAI 4o), sem expor chaves no navegador.

### 🛍️ Experiência do Comprador
- **Interface Conversacional**: Chat intuitivo para descrever necessidades.
- **Carrinho de Orçamento**: O comprador pode ajustar quantidades das sugestões da IA antes de enviar.
- **Identificação de Cliente**: Cadastro simples integrado ao Supabase Auth.
- **Histórico**: Acesso a orçamentos anteriores e status de cada solicitação.

### 🏢 Painel do Lojista
- **Gestão de Pedidos**: Visualização detalhada de orçamentos pendentes, aprovados ou cancelados.
- **Dashboard de Performance**: Métricas de conversão e produtos mais sugeridos (Mock/Initial).
- **Catálogo Manual**: Possibilidade de cadastrar produtos diretamente no LumiIA (CRUD completo).
- **Configuração do Assistente**: Definição de tom de voz e prioridades da IA.

### 🔌 Integrações (Staging)
- **Bling**: Sincronização automatizada de catálogo via API v3.
- **Nuvemshop**: Instalação de app via OAuth e injeção de script de vitrine ("Botão de Orçamento com IA").
- **Criptografia de Tokens**: Todos os access_tokens de lojistas são salvos com AES-GCM 256 bits.

---

## 3. Como foi feito (Arquitetura Técnica)

### Frontend
- **Framework**: React + Vite.
- **Styling**: Tailwind CSS + Shadcn UI (Design Premium).
- **State Management**: React Query (TanStack) para cache de dados.
- **Routing**: React Router 6.

### Backend & Banco de Dados
- **Core**: Supabase (PostgreSQL).
- **Segurança (RLS)**: Row Level Security garante que um lojista nunca veja dados de outro.
- **Lógica Serverless**: 9 Edge Functions em Deno/TypeScript para tarefas pesadas e seguras.
- **Migrations**: Versionamento de banco de dados via Supabase CLI (Pronto para CI/CD).

### Deploy & Operação
- **Hospedagem**: Vercel (Frontend) + Supabase (Backend).
- **Routing SPA**: Configurado via `vercel.json` para evitar erros 404.
- **Ambientes**: Separação clara entre Local e Staging.

---

## 4. O que o projeto NÃO faz (Limitações Atuais)

- **Pagamentos**: O LumiIA gera o orçamento, mas não processa o checkout/pagamento final (deve ser feito no ERP ou loja original).
- **Chat em Tempo Real**: A interação com a IA é por turnos (pergunta/resposta), não há um chat humano-humano integrado ainda.
- **Automação de Estoque Reversa**: O LumiIA lê o estoque, mas não reserva produtos automaticamente no ERP ao criar o orçamento (apenas consulta).
- **Multi-idioma**: Atualmente focado 100% em Português (PT-BR).
- **App Mobile Nativo**: O sistema é Web Responsivo (PWA Ready), mas não possui app em lojas (iOS/Android).

---

## 5. Auditoria de Segurança
- [x] **Exposição de Chaves**: Nenhuma `OPENAI_API_KEY` ou Secret no frontend.
- [x] **Criptografia**: Tokens externos nunca são salvos em plain text.
- [x] **Isolamento**: Políticas de banco protegem a privacidade de compradores e lojistas.
- [x] **SPA Security**: Redirecionamentos seguros configurados.

---

## 6. Próximos Passos Recomendados
1. **Fase 11**: Validação de carga (testar catálogo com >1000 produtos).
2. **Fase 12**: Deploy de Produção (Main Branch) e configuração de domínios finais.
3. **Fase 13**: Integração de WhatsApp API para notificações automáticas de orçamento.
