// Dados simulados — Lumi Quotes

export const DEMO_STORE = {
    name: "Loja Demonstração",
    segment: "Presentes e Brinquedos",
    logoUrl: null,
    whatsapp: "(11) 99999-9999",
    primaryColor: "#1f4a32",
};

export const DEMO_PRODUCTS = [
    { id: "p1", name: "Kit Criativo Infantil Arco-Íris", description: "Kit completo com materiais criativos para crianças: tinta, pincel, massinha e bloco de desenho.", category: "Educativo", price: 89.90, stock_quantity: 45, image_url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80", tags: ["infantil", "meninas", "meninos", "6-10 anos", "educativo", "criativo", "presente", "kit"], target_audience: "crianças", age_range: "6-10 anos", use_case: "presente, escola", active: true, ai_readiness_status: "ready" },
    { id: "p2", name: "Boneca Fada Mágica com Acessórios", description: "Boneca colecionável com vestido de fada, varinha e coroa. Ideal para presente de meninas.", category: "Infantil", price: 129.90, stock_quantity: 32, image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", tags: ["infantil", "meninas", "6-10 anos", "presente", "brinquedo"], target_audience: "meninas", age_range: "5-12 anos", use_case: "presente, aniversário", active: true, ai_readiness_status: "ready" },
    { id: "p3", name: "Quebra-Cabeça Educativo 200 Peças", description: "Quebra-cabeça temático mapa do Brasil, 200 peças. Excelente para desenvolvimento cognitivo.", category: "Educativo", price: 64.90, stock_quantity: 67, image_url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80", tags: ["infantil", "meninas", "meninos", "educativo", "6-10 anos", "presente"], target_audience: "crianças", age_range: "6-12 anos", use_case: "presente, escola", active: true, ai_readiness_status: "ready" },
    { id: "p4", name: "Kit Slime Científico Completo", description: "Kit para fazer 6 tipos de slime em casa. Inclui glitter, corantes, ativador e manual.", category: "Educativo", price: 74.90, stock_quantity: 89, image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", tags: ["infantil", "meninas", "meninos", "educativo", "criativo", "6-10 anos", "presente", "kit"], target_audience: "crianças", age_range: "6-14 anos", use_case: "presente, diversão", active: true, ai_readiness_status: "ready" },
    { id: "p5", name: "Mochila Escolar Unicórnio", description: "Mochila escolar resistente com tema unicórnio, paetê reversível, compartimento para notebook.", category: "Acessórios", price: 149.90, stock_quantity: 28, image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", tags: ["infantil", "meninas", "6-10 anos", "escolar", "presente", "útil"], target_audience: "meninas", age_range: "6-12 anos", use_case: "volta às aulas, presente", active: true, ai_readiness_status: "ready" },
    { id: "p6", name: "Kit Spa Infantil Premium", description: "Kit de cuidados com creme hidratante, esmalte atóxico, tiara e toalha. Embalagem presente inclusa.", category: "Presentes", price: 119.90, stock_quantity: 41, image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", tags: ["infantil", "meninas", "presente", "premium", "kit", "6-10 anos"], target_audience: "meninas", age_range: "6-12 anos", use_case: "aniversário, dia das crianças", active: true, ai_readiness_status: "ready" },
    { id: "p7", name: "Livro de Colorir Gigante Animais", description: "Livro de colorir com 100 ilustrações de animais, papel reciclado, tamanho A3.", category: "Papelaria", price: 39.90, stock_quantity: 120, image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80", tags: ["infantil", "meninas", "meninos", "educativo", "criativo", "barato", "6-10 anos", "lembrancinha"], target_audience: "crianças", age_range: "4-10 anos", use_case: "presente, lembrancinha", active: true, ai_readiness_status: "ready" },
    { id: "p8", name: "Jogo de Tabuleiro Família Aventura", description: "Jogo de perguntas e desafios para toda a família. 2 a 6 jogadores, +6 anos.", category: "Educativo", price: 99.90, stock_quantity: 35, image_url: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&q=80", tags: ["infantil", "família", "meninas", "meninos", "presente", "educativo", "6-10 anos"], target_audience: "família, crianças", age_range: "6+", use_case: "presente, reunião familiar", active: true, ai_readiness_status: "ready" },
    { id: "p9", name: "Kit Pintura em Tela Iniciante", description: "Kit com 2 telas, 12 tintas acrílicas, 5 pincéis e cavalete de mesa.", category: "Educativo", price: 159.90, stock_quantity: 22, image_url: "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=400&q=80", tags: ["infantil", "adulto", "criativo", "educativo", "presente", "kit", "premium"], target_audience: "crianças e adultos", age_range: "8+", use_case: "presente, hobby", active: true, ai_readiness_status: "ready" },
    { id: "p10", name: "Pelúcia Urso Premium 40cm", description: "Pelúcia urso de pelagem macia premium, 40cm, lavável na máquina. Embalagem presente inclusa.", category: "Presentes", price: 89.90, stock_quantity: 58, image_url: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&q=80", tags: ["infantil", "bebê", "meninas", "meninos", "presente", "lembrancinha"], target_audience: "bebês e crianças", age_range: "0-10 anos", use_case: "aniversário, nascimento, lembrancinha", active: true, ai_readiness_status: "ready" },
    { id: "p11", name: "Kit Jardinagem Infantil", description: "Kit com 3 mini vasos, terra, sementes e regador. A criança planta e cuida das próprias plantas.", category: "Educativo", price: 69.90, stock_quantity: 44, image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80", tags: ["infantil", "educativo", "meninas", "meninos", "presente", "kit", "6-10 anos"], target_audience: "crianças", age_range: "5-12 anos", use_case: "presente, dia das crianças", active: true, ai_readiness_status: "ready" },
    { id: "p12", name: "Perfume Infantil Floral 30ml", description: "Eau de toilette infantil com notas florais suaves, sem álcool.", category: "Beleza", price: 79.90, stock_quantity: 0, image_url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&q=80", tags: ["infantil", "meninas", "presente", "beleza"], target_audience: "meninas", age_range: "3-12 anos", use_case: "presente aniversário", active: true, ai_readiness_status: "out_of_stock" },
    { id: "p13", name: "Cesta Premium Corporativa", description: "Cesta sofisticada com chocolates importados, vinho espumante, perfume e cartão personalizado.", category: "Presentes", price: 249.90, stock_quantity: 15, image_url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80", tags: ["presente", "premium", "feminino", "adulto", "empresa", "corporativo"], target_audience: "adultos", age_range: "adulto", use_case: "presente corporativo, dia das mães", active: true, ai_readiness_status: "ready" },
    { id: "p14", name: "Kit Escritório Minimalista", description: "Kit com porta-lápis em bambu, bloco de notas, canetas coloridas e mousepad. Estilo minimalista.", category: "Papelaria", price: 119.90, stock_quantity: 37, image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80", tags: ["adulto", "presente", "útil", "escritório", "empresa", "corporativo", "masculino", "feminino"], target_audience: "adultos", age_range: "adulto", use_case: "presente corporativo, aniversário", active: true, ai_readiness_status: "ready" },
    { id: "p15", name: "Vela Aromática Luxo", description: "Vela de cera de soja com óleo essencial de lavanda e baunilha. 30h de queima. Embalagem premium.", category: "Casa", price: 89.90, stock_quantity: 62, image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80", tags: ["presente", "feminino", "adulto", "premium", "lembrancinha", "empresa"], target_audience: "adultas", age_range: "adulto", use_case: "aniversário, dia das mães, empresa", active: true, ai_readiness_status: "ready" },
    { id: "p16", name: "Organizador de Bolsa com Espelho", description: "Organizador de bolsa em material premium, 10 compartimentos, com espelho dobrável.", category: "Acessórios", price: 59.90, stock_quantity: 83, image_url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", tags: ["feminino", "adulto", "útil", "presente", "barato", "lembrancinha"], target_audience: "mulheres adultas", age_range: "adulto", use_case: "presente, lembrancinha", active: true, ai_readiness_status: "ready" },
    { id: "p17", name: "Livro Bestseller Autodesenvolvimento", description: "\"Hábitos Poderosos\" — bestseller nacional com 5 estrelas. Ideal para quem quer mudar de vida.", category: "Educativo", price: 49.90, stock_quantity: 91, image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80", tags: ["adulto", "educativo", "presente", "barato", "empresa", "masculino", "feminino", "lembrancinha"], target_audience: "adultos", age_range: "adulto", use_case: "presente, empresa", active: true, ai_readiness_status: "ready" },
    { id: "p18", name: "Kit Chá Premium Importado", description: "Caixa com 12 variedades de chás importados da Europa. Embalagem presente elegante.", category: "Casa", price: 139.90, stock_quantity: 29, image_url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", tags: ["adulto", "presente", "premium", "feminino", "masculino", "empresa"], target_audience: "adultos", age_range: "adulto", use_case: "presente corporativo, natal", active: true, ai_readiness_status: "ready" },
    { id: "p19", name: "Pochete Esportiva Unissex", description: "Pochete em neoprene, porta celular, chaves e cartão. Ajuste universal, resistente à água.", category: "Acessórios", price: 44.90, stock_quantity: 110, image_url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&q=80", tags: ["adulto", "esporte", "masculino", "feminino", "útil", "barato", "revenda", "lembrancinha"], target_audience: "adultos ativos", age_range: "adulto", use_case: "uso diário, revenda, lembrancinha", active: true, ai_readiness_status: "ready" },
    { id: "p20", name: "Conjunto Papelaria Kawaii", description: "Conjunto com agenda, canetas coloridas, adesivos e marca-páginas com tema japonês.", category: "Papelaria", price: 84.90, stock_quantity: 54, image_url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80", tags: ["infantil", "adolescente", "meninas", "presente", "criativo", "lembrancinha", "6-10 anos"], target_audience: "meninas e adolescentes", age_range: "8-16 anos", use_case: "presente, lembrancinha", active: true, ai_readiness_status: "ready" },
    { id: "p21", name: "Mousepad Gamer Grande", description: "Mousepad extra grande 80x40cm com bordas costuradas e base antiderrapante.", category: "Acessórios", price: 79.90, stock_quantity: 45, image_url: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80", tags: ["masculino", "adulto", "adolescente", "tecnologia", "presente", "útil", "revenda"], target_audience: "gamers e profissionais", age_range: "12+", use_case: "presente, uso pessoal, revenda", active: true, ai_readiness_status: "ready" },
    { id: "p22", name: "Kit Cuidados Masculino Premium", description: "Kit com pomada modeladora, shampoo sólido, condicionador e pente profissional.", category: "Beleza", price: 179.90, stock_quantity: 31, image_url: "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?w=400&q=80", tags: ["masculino", "adulto", "presente", "premium", "kit"], target_audience: "homens adultos", age_range: "adulto", use_case: "dia dos pais, aniversário", active: true, ai_readiness_status: "ready" },
    { id: "p23", name: "Porta-Retrato Digital WiFi", description: "Porta-retrato digital WiFi, troca fotos pelo app, resolução Full HD. Moldura branca elegante.", category: "Casa", price: 299.90, stock_quantity: 18, image_url: "https://images.unsplash.com/photo-1558618047-3d5e3b8ebb18?w=400&q=80", tags: ["presente", "adulto", "premium", "tecnologia", "empresa", "masculino", "feminino"], target_audience: "adultos", age_range: "adulto", use_case: "natal, aniversário, empresa", active: true, ai_readiness_status: "ready" },
    { id: "p24", name: "Almofada Personalizada Foto", description: "Almofada 40x40cm com impressão de foto personalizada. Enchimento premium, lavável.", category: "Casa", price: 69.90, stock_quantity: 75, image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", tags: ["presente", "personalizado", "adulto", "família", "barato", "lembrancinha"], target_audience: "todos", age_range: "qualquer", use_case: "qualquer ocasião, lembrancinha", active: true, ai_readiness_status: "ready" },
    { id: "p25", name: "Jogo de Xadrez em Madeira", description: "Jogo de xadrez em madeira maciça, tabuleiro dobrável, peças esculpidas à mão.", category: "Educativo", price: 199.90, stock_quantity: 12, image_url: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&q=80", tags: ["adulto", "adolescente", "educativo", "premium", "presente", "masculino", "feminino", "empresa"], target_audience: "adultos e adolescentes", age_range: "10+", use_case: "natal, aniversário, empresa", active: true, ai_readiness_status: "ready" },
    { id: "p26", name: "Gel de Banho Premium 500ml", description: "Gel de banho com extrato de rosa e hortelã, sem parabenos, fórmula vegana.", category: "Beleza", price: 45.90, stock_quantity: 88, image_url: "https://images.unsplash.com/photo-1571782742078-26a66dc9e1ba?w=400&q=80", tags: ["feminino", "adulto", "presente", "barato", "lembrancinha", "empresa"], target_audience: "mulheres adultas", age_range: "adulto", use_case: "presente, lembrancinha, empresa", active: true, ai_readiness_status: "ready" },
    { id: "p27", name: "Suporte Celular Carro Universal", description: "Suporte magnético para celular, compatível com todos os modelos, fixação no painel.", category: "Acessórios", price: 34.90, stock_quantity: 134, image_url: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&q=80", tags: ["útil", "masculino", "feminino", "barato", "revenda", "lembrancinha"], target_audience: "motoristas", age_range: "adulto", use_case: "uso diário, revenda, lembrancinha", active: true, ai_readiness_status: "ready" },
    { id: "p28", name: "Kit Revenda Utilidades 10 Peças", description: "Kit com 10 produtos de utilidade doméstica sortidos: porta-temperos, descascador, ralo dourado e mais. Ideal para revenda.", category: "Utilidades", price: 149.90, stock_quantity: 200, image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", tags: ["revenda", "utilidades", "barato", "atacado", "adulto", "alta margem", "kit"], target_audience: "revendedores", age_range: "adulto", use_case: "revenda, atacado", active: true, ai_readiness_status: "ready" },
    { id: "p29", name: "Kit Lembrancinha Casamento 30 Peças", description: "Kit com 30 lembrancinhas elegantes para casamento: sachês aromáticos personalizados.", category: "Presentes", price: 189.90, stock_quantity: 40, image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80", tags: ["lembrancinha", "adulto", "presente", "feminino", "atacado", "kit", "empresa"], target_audience: "noivos, eventos", age_range: "adulto", use_case: "casamento, eventos, festa", active: true, ai_readiness_status: "ready" },
    { id: "p30", name: "Kit Lembrancinha Infantil 20 Peças", description: "Kit com 20 lembrancinhas para festa infantil: massinha, lápis coloridos e balinhas embaladas.", category: "Infantil", price: 129.90, stock_quantity: 65, image_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80", tags: ["infantil", "lembrancinha", "meninas", "meninos", "6-10 anos", "festa", "kit", "atacado"], target_audience: "crianças", age_range: "3-10 anos", use_case: "festa, aniversário infantil, lembrancinha", active: true, ai_readiness_status: "ready" },
    { id: "p31", name: "Nécessaire Viagem Elegante", description: "Nécessaire em couro sintético com zíper duplo, 3 compartimentos internos. Ideal para viagem.", category: "Acessórios", price: 54.90, stock_quantity: 66, image_url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80", tags: ["feminino", "adulto", "útil", "presente", "barato", "lembrancinha", "empresa"], target_audience: "mulheres adultas", age_range: "adulto", use_case: "presente, lembrancinha, empresa", active: true, ai_readiness_status: "ready" },
    { id: "p32", name: "Caneca Personalizada Premium", description: "Caneca de cerâmica 300ml com impressão em alta qualidade. Ideal para presente corporativo.", category: "Presentes", price: 39.90, stock_quantity: 150, image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80", tags: ["empresa", "corporativo", "lembrancinha", "barato", "adulto", "masculino", "feminino", "atacado"], target_audience: "todos", age_range: "adulto", use_case: "empresa, lembrancinha, brinde", active: true, ai_readiness_status: "ready" },
];

// Demo quote requests for store panel
export const DEMO_QUOTE_REQUESTS = [
    {
        id: "qr1", customerName: "Mariana Oliveira", customerContact: "(11) 99876-5432",
        originalPrompt: "Quero montar um kit para meninas de 6 a 10 anos, até R$ 500, com produtos criativos.",
        interpretedNeed: "Presente infantil feminino, faixa 6-10 anos, orçamento até R$ 500, foco criativo",
        estimatedTotal: 384.60, status: "new", createdAt: "2026-05-07",
        items: [
            { product_name: "Kit Criativo Infantil Arco-Íris", quantity: 2, unit_price: 89.90, subtotal: 179.80, reason: "Produto principal para a faixa etária" },
            { product_name: "Boneca Fada Mágica com Acessórios", quantity: 1, unit_price: 129.90, subtotal: 129.90, reason: "Complemento ideal para meninas" },
            { product_name: "Kit Slime Científico Completo", quantity: 1, unit_price: 74.90, subtotal: 74.90, reason: "Opção educativa e divertida" },
        ]
    },
    {
        id: "qr2", customerName: "Empresa ABC Ltda", customerContact: "compras@empresaabc.com.br",
        originalPrompt: "Quero lembrancinhas para presentear 50 funcionários.",
        interpretedNeed: "Lembrancinha corporativa para 50 pessoas, adultos, empresa",
        estimatedTotal: 2495.00, status: "in_review", createdAt: "2026-05-06",
        items: [
            { product_name: "Caneca Personalizada Premium", quantity: 50, unit_price: 39.90, subtotal: 1995.00, reason: "Clássico corporativo, personalizável" },
            { product_name: "Gel de Banho Premium 500ml", quantity: 50, unit_price: 45.90, subtotal: 500.00, reason: "Complemento prático e elegante" },
        ]
    },
    {
        id: "qr3", customerName: "Ricardo Mendes", customerContact: "ricardo@email.com",
        originalPrompt: "Preciso de produtos para revender. Tenho R$ 1.500 para investir.",
        interpretedNeed: "Revenda, orçamento R$ 1.500, foco em margem e volume",
        estimatedTotal: 1498.00, status: "answered", createdAt: "2026-05-04",
        items: [
            { product_name: "Kit Revenda Utilidades 10 Peças", quantity: 5, unit_price: 149.90, subtotal: 749.50, reason: "Alta rotatividade, boa margem" },
            { product_name: "Suporte Celular Carro Universal", quantity: 10, unit_price: 34.90, subtotal: 349.00, reason: "Produto com alta saída" },
            { product_name: "Pochete Esportiva Unissex", quantity: 8, unit_price: 44.90, subtotal: 359.20, reason: "Tendência, fácil venda" },
        ]
    },
    {
        id: "qr4", customerName: "Ana Beatriz Costa", customerContact: "(51) 95432-1098",
        originalPrompt: "Kit premium para presentear minha chefe. Até R$ 400.",
        interpretedNeed: "Presente feminino adulto premium, até R$ 400",
        estimatedTotal: 369.70, status: "approved", createdAt: "2026-05-03",
        items: [
            { product_name: "Cesta Premium Corporativa", quantity: 1, unit_price: 249.90, subtotal: 249.90, reason: "Presente completo e sofisticado" },
            { product_name: "Vela Aromática Luxo", quantity: 1, unit_price: 89.90, subtotal: 89.90, reason: "Complemento premium" },
            { product_name: "Kit Chá Premium Importado", quantity: 1, unit_price: 139.90, subtotal: 29.90, reason: "Toque elegante final" },
        ]
    },
    {
        id: "qr5", customerName: "João Pedro Santos", customerContact: "(21) 98765-4321",
        originalPrompt: "Quero montar lembrancinhas para festa de aniversário infantil, 30 crianças.",
        interpretedNeed: "Lembrancinha infantil, 30 unidades, festa de aniversário",
        estimatedTotal: 389.70, status: "lost", createdAt: "2026-04-28",
        items: [
            { product_name: "Kit Lembrancinha Infantil 20 Peças", quantity: 2, unit_price: 129.90, subtotal: 259.80, reason: "Kit ideal para festas infantis" },
            { product_name: "Livro de Colorir Gigante Animais", quantity: 3, unit_price: 39.90, subtotal: 119.70, reason: "Complemento educativo e divertido" },
        ]
    },
];

// Simulated AI engine — for customer-facing quote assistant
export function simulateAIRecommendation(prompt) {
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

        score = Math.min(99, Math.max(35, score));
        return { ...p, compatibility_score: score };
    });

    scored.sort((a, b) => b.compatibility_score - a.compatibility_score);
    const top = scored.slice(0, 6);

    // Build intent tags
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

    const summary = `Entendi que você busca ${audienceSummary.join(" e ")}${ageRange ? `, para faixa etária de ${ageRange}` : ""}${budget ? `, com orçamento de até R$ ${budget}` : ""}${quantity ? `, para ${quantity} pessoas` : ""}. Selecionamos as opções mais adequadas do nosso catálogo.`;

    const reasonTemplates = [
        (p) => `Selecionamos este produto porque combina com o que você procura. ${p.use_case ? `Ideal para ${p.use_case}.` : ""} ${budget ? `Preço dentro do seu orçamento.` : ""}`,
        (p) => `${p.description?.split('.')[0] || p.name}. Ótima opção para o seu pedido.`,
        (p) => `Produto muito procurado para ocasiões como a sua. ${p.target_audience ? `Indicado para ${p.target_audience}.` : ""}`,
    ];

    return {
        summary,
        intentTags,
        items: top.map((p, i) => ({
            ...p,
            suggested_quantity: quantity ? Math.max(1, Math.ceil(quantity / top.length)) : 1,
            reason: reasonTemplates[i % reasonTemplates.length](p),
        })),
    };
}