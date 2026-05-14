-- Lumi Quotes - Initial Migration
-- Generates the base schema for Staging/Production

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLES

CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    segment TEXT,
    whatsapp TEXT,
    primary_color TEXT DEFAULT '#1f4a32',
    nuvemshop_store_id TEXT,
    bling_account_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS store_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    role TEXT DEFAULT 'owner',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, store_id)
);

CREATE TABLE IF NOT EXISTS buyer_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS buyer_store_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    buyer_user_id UUID REFERENCES buyer_users(id) ON DELETE CASCADE,
    preferred_budget_range TEXT,
    preferred_categories TEXT[],
    preferred_use_cases TEXT[],
    common_audience TEXT,
    average_order_value NUMERIC DEFAULT 0,
    notes_for_ai TEXT,
    consent_to_personalization BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(store_id, buyer_user_id)
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    external_id TEXT,
    source TEXT DEFAULT 'manual',
    sku TEXT,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    category TEXT,
    tags TEXT[],
    target_audience TEXT,
    age_range TEXT,
    use_case TEXT,
    active BOOLEAN DEFAULT TRUE,
    raw_data JSONB,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    buyer_user_id UUID REFERENCES buyer_users(id) ON DELETE CASCADE,
    original_prompt TEXT NOT NULL,
    interpreted_need JSONB,
    estimated_total NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'sent',
    customer_contact_name TEXT,
    customer_contact_email TEXT,
    customer_contact_phone TEXT,
    consent_to_contact BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_status CHECK (status IN ('sent', 'in_review', 'answered', 'approved', 'canceled', 'lost'))
);

CREATE TABLE IF NOT EXISTS quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_request_id UUID REFERENCES quote_requests(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    reason TEXT,
    personalized_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendation_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    buyer_user_id UUID REFERENCES buyer_users(id) ON DELETE CASCADE,
    quote_request_id UUID REFERENCES quote_requests(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_action CHECK (action IN ('added', 'removed', 'increased_quantity', 'decreased_quantity', 'replaced', 'approved'))
);

CREATE TABLE IF NOT EXISTS assistant_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
    tone TEXT DEFAULT 'consultivo',
    minimum_quote_value NUMERIC,
    prioritize_stock BOOLEAN DEFAULT TRUE,
    prioritize_margin BOOLEAN DEFAULT FALSE,
    prioritize_best_sellers BOOLEAN DEFAULT FALSE,
    final_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    status TEXT DEFAULT 'not_connected',
    access_token_encrypted TEXT,
    refresh_token_encrypted TEXT,
    expires_at TIMESTAMPTZ,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_provider CHECK (provider IN ('nuvemshop', 'bling', 'ai', 'whatsapp', 'email')),
    CONSTRAINT valid_status CHECK (status IN ('not_connected', 'connected', 'syncing', 'error'))
);

-- 2. INDEXES

CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE UNIQUE INDEX IF NOT EXISTS products_store_sku_unique ON products (store_id, sku) WHERE sku IS NOT NULL AND sku <> '';
CREATE INDEX IF NOT EXISTS idx_quote_requests_store_id ON quote_requests(store_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_buyer_id ON quote_requests(buyer_user_id);
CREATE UNIQUE INDEX IF NOT EXISTS integrations_store_provider_unique ON integrations (store_id, provider);
CREATE UNIQUE INDEX IF NOT EXISTS products_store_source_external_id_unique ON products (store_id, source, external_id) WHERE external_id IS NOT NULL AND external_id <> '';
CREATE UNIQUE INDEX IF NOT EXISTS stores_nuvemshop_store_id_unique ON stores (nuvemshop_store_id) WHERE nuvemshop_store_id IS NOT NULL AND nuvemshop_store_id <> '';

-- 3. INTEGRATION TABLES (Phases 7 & 8)

CREATE TABLE IF NOT EXISTS integration_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    status TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT now(),
    finished_at TIMESTAMPTZ,
    products_found INTEGER DEFAULT 0,
    products_created INTEGER DEFAULT 0,
    products_updated INTEGER DEFAULT 0,
    products_skipped INTEGER DEFAULT 0,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT valid_status CHECK (status IN ('running', 'success', 'partial_success', 'error'))
);

CREATE TABLE IF NOT EXISTS integration_oauth_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    state TEXT UNIQUE NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS storefront_quote_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
    enabled BOOLEAN DEFAULT FALSE,
    button_text TEXT DEFAULT 'Criar orçamento personalizado com IA',
    button_subtitle TEXT,
    button_position TEXT DEFAULT 'floating',
    button_color TEXT,
    show_on_home BOOLEAN DEFAULT TRUE,
    show_on_product_pages BOOLEAN DEFAULT TRUE,
    show_on_cart BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_position CHECK (button_position IN ('floating', 'product_area', 'bottom_bar'))
);

-- 4. RLS

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyer_store_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_oauth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE storefront_quote_settings ENABLE ROW LEVEL SECURITY;

-- 5. HELPERS & POLICIES

CREATE OR REPLACE FUNCTION is_store_owner(store_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM store_owners
    WHERE store_id = store_uuid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_valid_buyer_of_store(store_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM buyer_store_profiles bsp
    JOIN buyer_users bu ON bsp.buyer_user_id = bu.id
    WHERE bsp.store_id = store_uuid AND bu.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STORES
CREATE POLICY "Public stores are readable by slug" ON stores FOR SELECT USING (TRUE);
CREATE POLICY "Owners can manage their stores" ON stores FOR ALL USING (is_store_owner(id));

-- BUYER_USERS
CREATE POLICY "Users can manage their own buyer profile" ON buyer_users FOR ALL USING (auth.uid() = user_id);

-- BUYER_STORE_PROFILES
CREATE POLICY "Buyers can manage their store profiles" ON buyer_store_profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM buyer_users WHERE id = buyer_user_id AND user_id = auth.uid())
);
CREATE POLICY "Owners can view buyer profiles for their store" ON buyer_store_profiles FOR SELECT USING (is_store_owner(store_id));

-- PRODUCTS
CREATE POLICY "Authenticated buyers can view active products" ON products FOR SELECT USING (active = TRUE AND (auth.role() = 'authenticated') AND is_valid_buyer_of_store(store_id));
CREATE POLICY "Owners can manage products" ON products FOR ALL USING (is_store_owner(store_id));

-- QUOTE_REQUESTS
CREATE POLICY "Buyers can manage their own quotes" ON quote_requests FOR ALL USING (EXISTS (SELECT 1 FROM buyer_users WHERE id = buyer_user_id AND user_id = auth.uid()));
CREATE POLICY "Owners can view quotes for their store" ON quote_requests FOR SELECT USING (is_store_owner(store_id));

-- QUOTE_ITEMS
CREATE POLICY "Buyers can view their own quote items" ON quote_items FOR SELECT USING (EXISTS (SELECT 1 FROM quote_requests qr JOIN buyer_users bu ON qr.buyer_user_id = bu.id WHERE qr.id = quote_request_id AND bu.user_id = auth.uid()));
CREATE POLICY "Owners can view quote items for their store" ON quote_items FOR SELECT USING (EXISTS (SELECT 1 FROM quote_requests WHERE id = quote_request_id AND is_store_owner(store_id)));

-- ASSISTANT_CONFIGS
CREATE POLICY "Authenticated buyers can view assistant configs" ON assistant_configs FOR SELECT USING ((auth.role() = 'authenticated') AND is_valid_buyer_of_store(store_id));
CREATE POLICY "Owners can manage assistant configs" ON assistant_configs FOR ALL USING (is_store_owner(store_id));

-- INTEGRATIONS
CREATE POLICY "Only owners can manage integrations" ON integrations FOR ALL USING (is_store_owner(store_id));
CREATE POLICY "Owners can manage their sync logs" ON integration_sync_logs FOR ALL USING (is_store_owner(store_id));
CREATE POLICY "Owners can manage their oauth states" ON integration_oauth_states FOR ALL USING (is_store_owner(store_id));

-- STOREFRONT SETTINGS
CREATE POLICY "Owners can manage their storefront settings" ON storefront_quote_settings FOR ALL USING (is_store_owner(store_id));
CREATE POLICY "Public can view active storefront settings" ON storefront_quote_settings FOR SELECT USING (enabled = TRUE);

-- 6. RPC

CREATE OR REPLACE FUNCTION create_quote_request_with_items(
    p_store_id UUID, p_original_prompt TEXT, p_interpreted_need JSONB, p_items JSONB,
    p_customer_contact_name TEXT, p_customer_contact_email TEXT, p_customer_contact_phone TEXT, p_consent_to_contact BOOLEAN
)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_buyer_user_id UUID; v_quote_request_id UUID; v_estimated_total NUMERIC := 0;
    v_item JSONB; v_product_id UUID; v_quantity INTEGER; v_unit_price NUMERIC; v_subtotal NUMERIC; v_result JSONB;
BEGIN
    SELECT id INTO v_buyer_user_id FROM buyer_users WHERE user_id = auth.uid();
    IF v_buyer_user_id IS NULL THEN RAISE EXCEPTION 'Comprador não autenticado.'; END IF;
    IF NOT EXISTS (SELECT 1 FROM buyer_store_profiles WHERE store_id = p_store_id AND buyer_user_id = v_buyer_user_id) THEN RAISE EXCEPTION 'Perfil não encontrado.'; END IF;

    INSERT INTO quote_requests (store_id, buyer_user_id, original_prompt, interpreted_need, customer_contact_name, customer_contact_email, customer_contact_phone, consent_to_contact, status)
    VALUES (p_store_id, v_buyer_user_id, p_original_prompt, p_interpreted_need, p_customer_contact_name, p_customer_contact_email, p_customer_contact_phone, p_consent_to_contact, 'sent')
    RETURNING id INTO v_quote_request_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        v_product_id := (v_item->>'productId')::UUID;
        v_quantity := (v_item->>'quantity')::INTEGER;
        SELECT price INTO v_unit_price FROM products WHERE id = v_product_id AND store_id = p_store_id AND active = TRUE AND stock_quantity > 0;
        IF v_unit_price IS NULL THEN RAISE EXCEPTION 'Produto inválido.'; END IF;
        v_subtotal := v_unit_price * v_quantity; v_estimated_total := v_estimated_total + v_subtotal;
        INSERT INTO quote_items (quote_request_id, product_id, quantity, unit_price, subtotal, reason, personalized_reason)
        VALUES (v_quote_request_id, v_product_id, v_quantity, v_unit_price, v_subtotal, v_item->>'reason', v_item->>'personalizedReason');
        INSERT INTO recommendation_feedback (store_id, buyer_user_id, quote_request_id, product_id, action)
        VALUES (p_store_id, v_buyer_user_id, v_quote_request_id, v_product_id, 'approved');
    END LOOP;

    UPDATE quote_requests SET estimated_total = v_estimated_total WHERE id = v_quote_request_id;
    UPDATE buyer_store_profiles SET average_order_value = (SELECT AVG(estimated_total) FROM quote_requests WHERE buyer_user_id = v_buyer_user_id AND store_id = p_store_id), updated_at = NOW() WHERE store_id = p_store_id AND buyer_user_id = v_buyer_user_id;

    SELECT jsonb_build_object('quote_request_id', v_quote_request_id, 'estimated_total', v_estimated_total, 'item_count', jsonb_array_length(p_items)) INTO v_result;
    RETURN v_result;
END;
$$;
