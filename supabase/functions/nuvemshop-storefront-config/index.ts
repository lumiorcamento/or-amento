import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const url = new URL(req.url)
    const nuvemshopStoreId = url.searchParams.get('storeId')
    
    if (!nuvemshopStoreId) throw new Error('storeId é obrigatório')

    // 1. Find store by nuvemshop_store_id
    const { data: store, error: storeError } = await supabaseClient
      .from('stores')
      .select('id, name, slug, primary_color')
      .eq('nuvemshop_store_id', nuvemshopStoreId)
      .single()

    if (storeError || !store) {
      return new Response(JSON.stringify({ enabled: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 2. Get storefront settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('storefront_quote_settings')
      .select('*')
      .eq('store_id', store.id)
      .single()

    if (settingsError || !settings || !settings.enabled) {
      return new Response(JSON.stringify({ enabled: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 3. Return safe public config
    const publicAppUrl = Deno.env.get('PUBLIC_APP_URL') || 'http://localhost:5173'
    
    const config = {
      enabled: true,
      storeName: store.name,
      storeSlug: store.slug,
      quoteUrl: `${publicAppUrl}/s/${store.slug}/orcamento?source=nuvemshop`,
      buttonText: settings.button_text,
      buttonSubtitle: settings.button_subtitle,
      buttonPosition: settings.button_position,
      buttonColor: settings.button_color || store.primary_color,
      showOnHome: settings.show_on_home,
      showOnProductPages: settings.show_on_product_pages,
      showOnCart: settings.show_on_cart
    }

    return new Response(JSON.stringify(config), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in nuvemshop-storefront-config:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
