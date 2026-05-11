-- Lumi Quotes - Seed Demo Data
-- Execute após o schema.sql para popular a loja de demonstração.

-- 1. Criar Loja Demo
INSERT INTO stores (id, name, slug, segment, whatsapp, primary_color)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'Loja Demonstração',
    'loja-demonstracao',
    'Presentes e Brinquedos',
    '(11) 99999-9999',
    '#1f4a32'
) ON CONFLICT (slug) DO NOTHING;

-- 2. Criar Configuração do Assistente
INSERT INTO assistant_configs (store_id, tone, prioritize_stock)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'consultivo',
    true
) ON CONFLICT (store_id) DO NOTHING;

-- 3. Criar Produtos Demo
-- P1
INSERT INTO products (store_id, name, description, category, price, stock_quantity, image_url, tags, target_audience, age_range, use_case)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'Kit Criativo Infantil Arco-Íris',
    'Kit completo com materiais criativos para crianças: tinta, pincel, massinha e bloco de desenho.',
    'Educativo',
    89.90,
    45,
    'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&q=80',
    ARRAY['infantil', 'meninas', 'meninos', '6-10 anos', 'educativo', 'criativo', 'presente', 'kit'],
    'crianças',
    '6-10 anos',
    'presente, escola'
);

-- P2
INSERT INTO products (store_id, name, description, category, price, stock_quantity, image_url, tags, target_audience, age_range, use_case)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'Boneca Fada Mágica com Acessórios',
    'Boneca colecionável com vestido de fada, varinha e coroa. Ideal para presente de meninas.',
    'Infantil',
    129.90,
    32,
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    ARRAY['infantil', 'meninas', '6-10 anos', 'presente', 'brinquedo'],
    'meninas',
    '5-12 anos',
    'presente, aniversário'
);

-- P3
INSERT INTO products (store_id, name, description, category, price, stock_quantity, image_url, tags, target_audience, age_range, use_case)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'Quebra-Cabeça Educativo 200 Peças',
    'Quebra-cabeça temático mapa do Brasil, 200 peças. Excelente para desenvolvimento cognitivo.',
    'Educativo',
    64.90,
    67,
    'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&q=80',
    ARRAY['infantil', 'meninas', 'meninos', 'educativo', '6-10 anos', 'presente'],
    'crianças',
    '6-12 anos',
    'presente, escola'
);

-- P4
INSERT INTO products (store_id, name, description, category, price, stock_quantity, image_url, tags, target_audience, age_range, use_case)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'Kit Slime Científico Completo',
    'Kit para fazer 6 tipos de slime em casa. Inclui glitter, corantes, ativador e manual.',
    'Educativo',
    74.90,
    89,
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
    ARRAY['infantil', 'meninas', 'meninos', 'educativo', 'criativo', '6-10 anos', 'presente', 'kit'],
    'crianças',
    '6-14 anos',
    'presente, diversão'
);

-- P5
INSERT INTO products (store_id, name, description, category, price, stock_quantity, image_url, tags, target_audience, age_range, use_case)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'Mochila Escolar Unicórnio',
    'Mochila escolar resistente com tema unicórnio, paetê reversível, compartimento para notebook.',
    'Acessórios',
    149.90,
    28,
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    ARRAY['infantil', 'meninas', '6-10 anos', 'escolar', 'presente', 'útil'],
    'meninas',
    '6-12 anos',
    'volta às aulas, presente'
);

-- P13
INSERT INTO products (store_id, name, description, category, price, stock_quantity, image_url, tags, target_audience, age_range, use_case)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'Cesta Premium Corporativa',
    'Cesta sofisticada com chocolates importados, vinho espumante, perfume e cartão personalizado.',
    'Presentes',
    249.90,
    15,
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400&q=80',
    ARRAY['presente', 'premium', 'feminino', 'adulto', 'empresa', 'corporativo'],
    'adultos',
    'adulto',
    'presente corporativo, dia das mães'
);
