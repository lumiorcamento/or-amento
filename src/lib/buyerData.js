// Dados simulados de compradores — Lumi Quotes

export const DEMO_BUYERS = [
    {
        id: "buyer1",
        name: "Ana Martins",
        email: "ana.martins@email.com",
        phone: "(11) 98765-4321",
        avatar: "AM",
        avatarColor: "#7c3aed",
        profile: {
            preferredBudgetRange: "R$ 300 a R$ 600",
            preferredCategories: ["Infantil", "Educativo", "Presentes"],
            preferredUseCases: ["presente", "aniversário infantil"],
            commonAudience: "crianças de 6 a 10 anos",
            averageOrderValue: 480,
            notesForAI: "costuma buscar kits para meninas de 6 a 10 anos, prefere custo-benefício, valoriza embalagem para presente",
            consentToPersonalization: true,
        },
        history: [
            {
                id: "h1", quoteId: "ORC-ANA01", date: "2026-04-12", status: "approved",
                originalPrompt: "Kit para meninas de 6 a 10 anos, até R$ 500",
                estimatedTotal: 384.60,
                items: [
                    { product_name: "Kit Criativo Infantil Arco-Íris", quantity: 2, unitPrice: 89.90, subtotal: 179.80, reason: "Produto principal para a faixa etária" },
                    { product_name: "Boneca Fada Mágica com Acessórios", quantity: 1, unitPrice: 129.90, subtotal: 129.90, reason: "Complemento ideal para meninas" },
                    { product_name: "Kit Slime Científico Completo", quantity: 1, unitPrice: 74.90, subtotal: 74.90, reason: "Opção educativa e divertida" },
                ]
            },
            {
                id: "h2", quoteId: "ORC-ANA02", date: "2026-03-05", status: "answered",
                originalPrompt: "Lembrancinhas para festa de aniversário, 20 crianças",
                estimatedTotal: 289.70,
                items: [
                    { product_name: "Kit Lembrancinha Infantil 20 Peças", quantity: 1, unitPrice: 129.90, subtotal: 129.90, reason: "Kit ideal para festas infantis" },
                    { product_name: "Livro de Colorir Gigante Animais", quantity: 4, unitPrice: 39.90, subtotal: 159.80, reason: "Complemento educativo e divertido" },
                ]
            },
        ],
        insights: [
            "Você costuma buscar kits para crianças de 6 a 10 anos",
            "Seu orçamento médio fica próximo de R$ 480",
            "Você prefere produtos com boa relação custo-benefício",
            "Você demonstrou interesse em kits para presente",
        ],
        historyChips: [
            { label: "Repetir estilo do último orçamento", prompt: "Kit para meninas de 6 a 10 anos, até R$ 500, com produtos criativos e custo-benefício" },
            { label: "Produtos infantis novamente", prompt: "Preciso de produtos para crianças, opções criativas e educativas" },
            { label: "Manter faixa de preço anterior", prompt: "Quero montar um orçamento até R$ 500 com produtos de qualidade" },
        ],
    },
    {
        id: "buyer2",
        name: "Carla Souza",
        email: "carla.souza@revendas.com",
        phone: "(21) 91234-5678",
        avatar: "CS",
        avatarColor: "#0891b2",
        profile: {
            preferredBudgetRange: "R$ 800 a R$ 1.500",
            preferredCategories: ["Utilidades", "Acessórios", "Papelaria"],
            preferredUseCases: ["revenda", "atacado"],
            commonAudience: "revendedores",
            averageOrderValue: 1200,
            notesForAI: "compra para revenda, prefere maior volume e boa margem, produtos com alta rotatividade",
            consentToPersonalization: true,
        },
        history: [
            {
                id: "h3", quoteId: "ORC-CAR01", date: "2026-05-01", status: "approved",
                originalPrompt: "Preciso de produtos para revender, R$ 1.500 disponível",
                estimatedTotal: 1498.00,
                items: [
                    { product_name: "Kit Revenda Utilidades 10 Peças", quantity: 5, unitPrice: 149.90, subtotal: 749.50, reason: "Alta rotatividade, boa margem" },
                    { product_name: "Suporte Celular Carro Universal", quantity: 10, unitPrice: 34.90, subtotal: 349.00, reason: "Produto com alta saída" },
                    { product_name: "Pochete Esportiva Unissex", quantity: 8, unitPrice: 44.90, subtotal: 359.20, reason: "Tendência, fácil venda" },
                ]
            },
            {
                id: "h4", quoteId: "ORC-CAR02", date: "2026-04-10", status: "answered",
                originalPrompt: "Produtos econômicos para revenda, até R$ 800",
                estimatedTotal: 795.50,
                items: [
                    { product_name: "Suporte Celular Carro Universal", quantity: 12, unitPrice: 34.90, subtotal: 418.80, reason: "Alta saída, fácil venda" },
                    { product_name: "Organizador de Bolsa com Espelho", quantity: 6, unitPrice: 59.90, subtotal: 359.40, reason: "Produto popular no varejo" },
                    { product_name: "Gel de Banho Premium 500ml", quantity: 4, unitPrice: 45.90, subtotal: 17.30, reason: "Bom giro" },
                ]
            },
        ],
        insights: [
            "Você costuma comprar para revenda",
            "Seu investimento médio é de R$ 1.200",
            "Você prefere produtos com alta rotatividade",
            "Você prefere maior quantidade por pedido",
        ],
        historyChips: [
            { label: "Repetir estilo do último orçamento", prompt: "Produtos para revenda com boa margem, investimento de R$ 1.500" },
            { label: "Sugestões parecidas com sua última compra", prompt: "Quero produtos de utilidade e acessórios para revender" },
            { label: "Manter faixa de preço anterior", prompt: "Quero produtos para revenda até R$ 1.200" },
        ],
    },
    {
        id: "buyer3",
        name: "João Pereira",
        email: "joao.pereira@empresa.com.br",
        phone: "(51) 93456-7890",
        avatar: "JP",
        avatarColor: "#059669",
        profile: {
            preferredBudgetRange: "R$ 1.500 a R$ 2.500",
            preferredCategories: ["Presentes", "Papelaria", "Casa"],
            preferredUseCases: ["presente corporativo", "brinde empresa"],
            commonAudience: "funcionários de empresa",
            averageOrderValue: 2000,
            notesForAI: "compra presentes corporativos para funcionários, prefere praticidade e apresentação, orçamentos maiores",
            consentToPersonalization: true,
        },
        history: [
            {
                id: "h5", quoteId: "ORC-JOA01", date: "2026-04-22", status: "approved",
                originalPrompt: "Presentes para 25 funcionários, até R$ 2.000",
                estimatedTotal: 1997.50,
                items: [
                    { product_name: "Caneca Personalizada Premium", quantity: 25, unitPrice: 39.90, subtotal: 997.50, reason: "Clássico corporativo, personalizável" },
                    { product_name: "Kit Escritório Minimalista", quantity: 5, unitPrice: 119.90, subtotal: 599.50, reason: "Presente executivo de alto impacto" },
                    { product_name: "Vela Aromática Luxo", quantity: 5, unitPrice: 89.90, subtotal: 449.50, reason: "Presente elegante e sofisticado" },
                ]
            },
        ],
        insights: [
            "Você costuma comprar presentes corporativos",
            "Seu orçamento médio é próximo de R$ 2.000",
            "Você prefere kits práticos e bem apresentados",
            "Você geralmente compra para grupos de funcionários",
        ],
        historyChips: [
            { label: "Repetir estilo do último orçamento", prompt: "Presentes corporativos para funcionários, até R$ 2.000" },
            { label: "Sugestões parecidas com sua última compra", prompt: "Kits de presente para empresa, bem apresentados" },
            { label: "Manter faixa de preço anterior", prompt: "Brindes corporativos até R$ 2.000" },
        ],
    },
];

export function getBuyerById(id) {
    return DEMO_BUYERS.find(b => b.id === id) || null;
}

export function simulateAIRecommendationWithHistory(prompt, buyer, DEMO_PRODUCTS) {
    const lower = prompt.toLowerCase();

    const detected = {
        infantil: /criança|infantil|menina|menino|filho|filha|criativ|brinc|6|7|8|9|10/.test(lower),
        feminino: /menina|feminino|mulher|mãe|ela|female/.test(lower),
        masculino: /menino|masculino|homem|pai|ele/.test(lower),
        premium: /premium|luxo|sofisticad|especial|exclusiv|melhor/.test(lower),
        barato: /barato|econômic|acessível|baixo custo|econom|custo.benef/.test(lower),
        revenda: /revend|lote|atacado|investir|negócio/.test(lower),
        educativo: /educativ|aprendiz|escola|aprend|cognitiv/.test(lower),
        presente: /presente|gift|aniversário|natal|mães|pais|presentear/.test(lower),
        lembrancinha: /lembrancinha|lembrança|lembrancinhas|festa|evento/.test(lower),
        empresa: /empresa|funcionário|corporativ|brinde|funcionarios|escritório/.test(lower),
        kit: /kit|conjunto|combo/.test(lower),
    };

    const budgetMatch = prompt.match(/r\$\s*(\d[\d.]*)/i) || prompt.match(/(\d+)\s*reais/i) || prompt.match(/até\s*(\d+)/i) || prompt.match(/investir\s+r?\$?\s*(\d+)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace('.', '')) : null;
    const ageMatch = prompt.match(/(\d+)\s*a\s*(\d+)\s*anos/i);
    const ageRange = ageMatch ? `${ageMatch[1]}-${ageMatch[2]} anos` : null;
    const qtyMatch = prompt.match(/(\d+)\s*(pessoas|funcionários|crianças|unidades|peças)/i);
    const quantity = qtyMatch ? parseInt(qtyMatch[1]) : null;

    // Build history context from buyer profile
    const historyContext = buyer?.profile?.notesForAI || "";
    const historyCategories = buyer?.profile?.preferredCategories || [];
    const hasHistory = !!buyer && (buyer.history?.length > 0);

    const scored = DEMO_PRODUCTS.filter(p => p.active && p.stock_quantity > 0).map(p => {
        let score = 50;
        const txt = `${p.name} ${p.description || ""} ${(p.tags || []).join(" ")} ${p.category || ""} ${p.target_audience || ""} ${p.use_case || ""}`.toLowerCase();

        if (detected.infantil && /infantil|criança|menina|menino/.test(txt)) score += 30;
        if (detected.feminino && /menina|feminino|mulher/.test(txt)) score += 20;
        if (detected.masculino && /menino|masculino|homem/.test(txt)) score += 20;
        if (detected.premium && /premium|luxo|especial/.test(txt)) score += 25;
        if (detected.barato && p.price < 100) score += 25;
        if (detected.revenda && /revend|atacado/.test(txt)) score += 40;
        if (detected.educativo && /educativ|aprendiz/.test(txt)) score += 25;
        if (detected.presente && /presente/.test(txt)) score += 15;
        if (detected.lembrancinha && /lembrancinha/.test(txt)) score += 30;
        if (detected.empresa && /empresa|corporativ|brinde/.test(txt)) score += 30;
        if (detected.kit && /kit/.test(txt)) score += 15;
        if (budget && p.price <= budget) score += 15;
        if (budget && p.price > budget * 0.7) score -= 10;
        if (budget && p.price > budget) score -= 35;
        if (ageRange && txt.includes(ageMatch[1])) score += 10;
        if (p.stock_quantity > 50) score += 5;

        // Boost from buyer history profile
        if (hasHistory) {
            const notesTxt = historyContext.toLowerCase();
            if (/infantil|criança/.test(notesTxt) && /infantil|criança/.test(txt)) score += 20;
            if (/revenda/.test(notesTxt) && /revend|atacado/.test(txt)) score += 20;
            if (/corporat|empresa/.test(notesTxt) && /empresa|corporat/.test(txt)) score += 20;
            if (/custo.benef/.test(notesTxt) && p.price < 100) score += 10;
            historyCategories.forEach(cat => {
                if (p.category && p.category.toLowerCase() === cat.toLowerCase()) score += 15;
            });
        }

        score = Math.min(99, Math.max(35, score));
        // Mark if influenced by history
        const fromHistory = hasHistory && score > 70 && (
            historyCategories.includes(p.category) ||
            /infantil|criança/.test(historyContext.toLowerCase()) && /infantil|criança/.test(txt) ||
            /revenda/.test(historyContext.toLowerCase()) && /revend/.test(txt)
        );

        return { ...p, compatibility_score: score, fromHistory };
    });

    scored.sort((a, b) => b.compatibility_score - a.compatibility_score);
    const top = scored.slice(0, 6);

    const intentTags = [];
    if (detected.infantil) intentTags.push("Infantil");
    if (detected.feminino) intentTags.push("Feminino");
    if (detected.masculino) intentTags.push("Masculino");
    if (detected.premium) intentTags.push("Premium");
    if (detected.barato) intentTags.push("Custo-benefício");
    if (detected.revenda) intentTags.push("Revenda");
    if (detected.educativo) intentTags.push("Educativo");
    if (detected.presente) intentTags.push("Presente");
    if (detected.lembrancinha) intentTags.push("Lembrancinha");
    if (detected.empresa) intentTags.push("Empresa");
    if (detected.kit) intentTags.push("Kit");
    if (ageRange) intentTags.push(ageRange);
    if (budget) intentTags.push(`Até R$ ${budget}`);
    if (quantity) intentTags.push(`${quantity} unidades`);

    let audienceSummary = [];
    if (detected.infantil) audienceSummary.push("produtos infantis");
    if (detected.feminino) audienceSummary.push("perfil feminino");
    if (detected.masculino) audienceSummary.push("perfil masculino");
    if (detected.revenda) audienceSummary.push("revenda");
    if (detected.lembrancinha) audienceSummary.push("lembrancinhas");
    if (detected.empresa) audienceSummary.push("uso corporativo");
    if (audienceSummary.length === 0) audienceSummary.push("sua necessidade");

    const summaryBase = `Entendi que você busca ${audienceSummary.join(" e ")}${ageRange ? `, para faixa etária de ${ageRange}` : ""}${budget ? `, com orçamento de até R$ ${budget}` : ""}${quantity ? `, para ${quantity} pessoas` : ""}.`;
    const historySuffix = hasHistory ? ` Também consideramos suas preferências anteriores por ${buyer.profile.preferredCategories.slice(0, 2).join(" e ").toLowerCase()}.` : " Como este é seu primeiro orçamento, usamos apenas o pedido atual e os produtos disponíveis na loja.";
    const summary = summaryBase + historySuffix;

    const reasonTemplates = [
        (p) => {
            const base = `${p.description?.split('.')[0] || p.name}. Ideal para o seu pedido.`;
            return p.fromHistory ? base + " Também combina com seu histórico de interesse." : base;
        },
        (p) => {
            const base = `Produto muito procurado para ocasiões como a sua.${p.target_audience ? ` Indicado para ${p.target_audience}.` : ""}`;
            return p.fromHistory ? base + " Combina com suas preferências anteriores." : base;
        },
        (p) => {
            const base = `Selecionamos este produto porque combina com o que você procura.${p.use_case ? ` Ideal para ${p.use_case}.` : ""}`;
            return base;
        },
    ];

    return {
        summary,
        intentTags,
        usedHistory: hasHistory,
        items: top.map((p, i) => ({
            ...p,
            suggested_quantity: quantity ? Math.max(1, Math.ceil(quantity / top.length)) : 1,
            reason: reasonTemplates[i % reasonTemplates.length](p),
        })),
    };
}