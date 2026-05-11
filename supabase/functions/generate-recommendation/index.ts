import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 1. Get User Auth
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Não autorizado')

    // 2. Parse Request
    const { storeId, prompt, mode = 'recommended', quoteStyle, refinement } = await req.json()
    if (!storeId || !prompt) throw new Error('storeId e prompt são obrigatórios')
    if (prompt.length < 3) throw new Error('Pedido muito curto')
    if (prompt.length > 500) throw new Error('Pedido muito longo para processamento')

    // 3. Fetch Data
    // 3.1 Buyer Profile & Store Profile
    const { data: buyerUser } = await supabaseClient
      .from('buyer_users')
      .select('id, name')
      .eq('user_id', user.id)
      .single()

    if (!buyerUser) throw new Error('Perfil de comprador não encontrado')

    const { data: storeProfile } = await supabaseClient
      .from('buyer_store_profiles')
      .select('*')
      .eq('store_id', storeId)
      .eq('buyer_user_id', buyerUser.id)
      .single()

    // 3.2 Store Config
    const { data: assistantConfig } = await supabaseClient
      .from('assistant_configs')
      .select('*')
      .eq('store_id', storeId)
      .single()

    // 3.3 Active Products with Stock
    const { data: allProducts, error: prodError } = await supabaseClient
      .from('products')
      .select('id, name, description, price, stock_quantity, category, tags, target_audience, age_range, use_case')
      .eq('store_id', storeId)
      .eq('active', true)
      .gt('stock_quantity', 0)

    if (prodError || !allProducts) throw new Error('Erro ao buscar produtos')

    // 3.4 History (Last 5 quotes)
    const { data: history } = await supabaseClient
      .from('quote_requests')
      .select('original_prompt, estimated_total, status, created_at')
      .eq('store_id', storeId)
      .eq('buyer_user_id', buyerUser.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // 4. Pre-filter Products (Ranking candidates)
    const candidates = selectCandidateProducts(allProducts, prompt, storeProfile, history)
    
    // 5. Call AI
    const recommendation = await generateAIRecommendation({
      prompt,
      candidates,
      buyerProfile: storeProfile,
      history,
      config: assistantConfig,
      refinement,
      quoteStyle
    })

    // 6. Final Validation & Enrichment
    const validatedResult = validateAndEnrichResult(recommendation, allProducts)

    return new Response(JSON.stringify(validatedResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in generate-recommendation:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true // Tell frontend it can try local fallback if needed
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

/**
 * Selects up to 40 candidate products based on the prompt and history
 */
function selectCandidateProducts(products, prompt, profile, history) {
  const lowerPrompt = prompt.toLowerCase()
  
  const scored = products.map(p => {
    let score = 0
    const txt = `${p.name} ${p.description} ${p.category} ${p.tags?.join(' ')}`.toLowerCase()
    
    // Basic Keyword Match
    const words = lowerPrompt.split(' ').filter(w => w.length > 2)
    words.forEach(w => {
      if (txt.includes(w)) score += 10
    })

    // Category match
    if (profile?.preferred_categories?.some(cat => p.category?.toLowerCase() === cat.toLowerCase())) {
      score += 5
    }

    // High stock bonus
    if (p.stock_quantity > 10) score += 2

    return { ...p, _score: score }
  })

  return scored
    .sort((a, b) => b._score - a._score)
    .slice(0, 40)
    .map(({ _score, ...p }) => p)
}

/**
 * Calls AI Provider (OpenAI default)
 */
async function generateAIRecommendation({ prompt, candidates, buyerProfile, history, config, refinement, quoteStyle }) {
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  const model = Deno.env.get('AI_MODEL') || 'gpt-3.5-turbo'
  
  if (!apiKey) {
    // If no API key, return a basic fallback immediately
    return generateLocalFallback(prompt, candidates)
  }

  const systemPrompt = `Você é um assistente de orçamento inteligente para uma loja online.
Sua tarefa é montar um orçamento personalizado usando APENAS os produtos fornecidos na lista de candidatos.

REGRAS CRÍTICAS:
1. NUNCA invente produtos ou IDs. Use apenas os productId fornecidos.
2. NUNCA invente preços.
3. Responda APENAS com JSON válido seguindo o schema solicitado.
4. Considere o tom de voz da loja: ${config?.tone || 'consultivo'}.
5. Se houver histórico do comprador, use-o para personalizar a justificativa se o comprador deu consentimento (${buyerProfile?.consent_to_personalization}).

FORMATO JSON:
{
  "interpretedNeed": {
    "summary": "Resumo do que o cliente quer",
    "audience": "Para quem é",
    "ageRange": "Faixa etária detectada",
    "budget": "Orçamento detectado",
    "useCase": "Caso de uso (ex: presente)",
    "preferences": ["preferencia1", "preferencia2"]
  },
  "recommendationSummary": "Texto comercial explicando a seleção",
  "items": [
    {
      "productId": "ID do produto",
      "quantity": 1,
      "reason": "Motivo da escolha",
      "personalizedReason": "Motivo personalizado baseado no perfil (se aplicável)",
      "priority": "high|medium|low"
    }
  ],
  "commercialText": "Texto final de fechamento",
  "confidenceNotes": ["Nota 1", "Nota 2"]
}`

  const userContext = `
Pedido do cliente: "${prompt}"
${refinement ? `Ajuste solicitado: ${refinement}` : ''}
${quoteStyle ? `Estilo preferido: ${quoteStyle}` : ''}

Perfil do Comprador:
- Categorias preferidas: ${buyerProfile?.preferred_categories?.join(', ') || 'Não informado'}
- Notas para IA: ${buyerProfile?.notes_for_ai || 'Nenhuma'}

Produtos Candidatos:
${JSON.stringify(candidates.map(c => ({ id: c.id, name: c.name, price: c.price, stock: c.stock_quantity, cat: c.category })))}
`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContext }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    })

    const data = await response.json()
    const content = data.choices[0].message.content
    return JSON.parse(content)
  } catch (error) {
    console.error('AI Call failed:', error)
    return generateLocalFallback(prompt, candidates)
  }
}

/**
 * Validates the AI response and adds real product data
 */
function validateAndEnrichResult(aiResult, allProducts) {
  if (!aiResult || !aiResult.items) return generateLocalFallback('', allProducts.slice(0, 3))

  const validItems = aiResult.items
    .map(item => {
      const product = allProducts.find(p => p.id === item.productId)
      if (!product) return null
      
      // Limit quantity to stock
      const finalQty = Math.max(1, Math.min(item.quantity || 1, product.stock_quantity))
      
      return {
        ...item,
        productId: product.id, // Ensure it matches real ID
        quantity: finalQty,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        subtotal: product.price * finalQty
      }
    })
    .filter(Boolean)

  if (validItems.length === 0) return generateLocalFallback('', allProducts.slice(0, 3))

  return {
    ...aiResult,
    items: validItems,
    totalEstimated: validItems.reduce((sum, item) => sum + item.subtotal, 0)
  }
}

/**
 * Simple deterministic fallback
 */
function generateLocalFallback(prompt, products) {
  const items = products.slice(0, 3).map(p => ({
    productId: p.id,
    quantity: 1,
    name: p.name,
    price: p.price,
    image_url: p.image_url,
    reason: "Selecionamos este produto por ser um dos mais populares da loja.",
    personalizedReason: "Este item combina com o seu pedido atual.",
    priority: "high",
    subtotal: p.price
  }))

  return {
    interpretedNeed: {
      summary: "Montamos uma seleção com base nos produtos disponíveis.",
      audience: "Geral",
      preferences: []
    },
    recommendationSummary: "Não conseguimos processar o pedido com IA no momento, mas selecionamos excelentes opções para você.",
    items,
    commercialText: "O que achou destas sugestões?",
    confidenceNotes: ["Sugestão automática de fallback"],
    totalEstimated: items.reduce((sum, i) => sum + i.subtotal, 0)
  }
}
