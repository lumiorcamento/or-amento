# Configuração do Catálogo via Bling ERP

O Bling é a fonte oficial de dados para o LumiIA. Através dele, a IA saberá quais produtos você tem em estoque, os preços atualizados e as descrições técnicas.

## Pré-requisitos no Bling

1.  Ter uma conta no Bling.
2.  Criar um **Aplicativo** no portal [Bling Developers](https://developer.bling.com.br/):
    *   **Nome**: LumiIA (ou o nome da sua loja).
    *   **Redirect URI**: `https://lumiia-black.vercel.app/lojista/conectar/bling/callback`
    *   **Escopos necessários**: `gerais`, `produtos`, `estoques`.

## Passo a Passo no LumiIA

1.  Acesse o painel do lojista em **Conectar**.
2.  Clique em **Conectar Bling ERP**.
3.  Você será redirecionado para o Bling. Autorize o acesso.
4.  Após retornar, clique no botão **Sincronizar Agora**.
5.  O LumiIA buscará seus produtos ativos e com estoque.

---

## O que é sincronizado?

-   **Nome e SKU**: Identificação única.
-   **Preço**: Para cálculo de orçamentos.
-   **Estoque**: A IA nunca recomendará produtos sem estoque.
-   **Descrição**: Base de conhecimento para a IA entender o produto.
-   **Imagens**: Para exibição no orçamento do cliente.
-   **Categorias**: Ajuda a IA a organizar as sugestões.

---

## Dicas para uma IA melhor

Para que o assistente seja mais assertivo, garanta que no Bling:
-   Os nomes dos produtos sejam claros.
-   As descrições contenham detalhes técnicos ou de uso (ex: "indicado para crianças de 5 a 8 anos").
-   As categorias estejam bem organizadas.
