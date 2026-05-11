# Validação Ponta a Ponta (E2E) - LumiIA

Este documento define os cenários principais de teste para garantir que o sistema funciona como um todo.

## Cenário 1: Jornada do Comprador via Nuvemshop
1. **Entrada**: Cliente clica no botão "Criar orçamento com IA" na vitrine da Nuvemshop.
2. **Login**: Cliente é levado ao LumiIA e faz login/cadastro.
3. **Interação**: Cliente descreve sua necessidade ("Quero um presente de aniversário para meu filho de 10 anos que gosta de dinossauros").
4. **IA**: O assistente processa e sugere 3 produtos reais da loja (sincronizados do Bling).
5. **Ação**: Cliente remove um item e ajusta a quantidade de outro.
6. **Finalização**: Cliente preenche dados de contato e envia o pedido.
7. **Resultado**: Cliente vê a tela de sucesso e histórico.

## Cenário 2: Gestão do Lojista
1. **Login**: Lojista acessa `/lojista/login`.
2. **Notificação**: Lojista vê um novo badge na lista de solicitações.
3. **Análise**: Lojista abre o detalhe da solicitação do Cenário 1.
4. **Contexto**: Lojista vê que o cliente já comprou na loja antes (Histórico).
5. **Edição**: Lojista altera o status para "Em Revisão".
6. **Resposta**: Lojista clica em "Copiar para WhatsApp" e envia a proposta personalizada.

## Cenário 3: Sincronização de Catálogo (Bling)
1. **Trigger**: Lojista clica em "Sincronizar Agora" no painel de conexões.
2. **Processo**: A Edge Function `bling-sync-products` é chamada.
3. **Validação**: Novos produtos aparecem na aba "Produtos" com o marcador `Source: Bling`.
4. **Integridade**: Produtos enriquecidos manualmente (IA Readiness) mantêm suas descrições e tags originais.

## Cenário 4: Customização da Vitrine (Nuvemshop)
1. **Configuração**: Lojista altera a cor do botão para azul e muda o texto para "Consultoria IA".
2. **Persistência**: Ao salvar, a tabela `storefront_quote_settings` é atualizada.
3. **Reflexo**: Ao atualizar a página da loja Nuvemshop, o botão reflete as novas configurações instantaneamente.
