import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { simulateAIRecommendationWithHistory } from "@/lib/buyerData";
import { DEMO_PRODUCTS } from "@/lib/demoData";

/**
 * Service for recommendation logic
 */
export const recommendationService = {
  /**
   * Generates a recommendation based on prompt and products
   */
  async generateRecommendation({ storeId, prompt, buyerProfile, mode = 'recommended', quoteStyle, refinement }) {
    if (!isSupabaseConfigured()) {
      // Demo fallback logic
      const result = simulateAIRecommendationWithHistory(
        prompt,
        buyerProfile || { name: 'Visitante' },
        DEMO_PRODUCTS
      );

      return {
        interpretedNeed: {
          summary: result.summary,
          audience: result.intentTags.join(', '),
          preferences: result.intentTags
        },
        recommendationSummary: result.summary,
        items: result.items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          image_url: item.image_url,
          quantity: item.suggested_quantity || 1,
          reason: item.reason,
          personalizedReason: item.reason,
          priority: "high",
          subtotal: item.price * (item.suggested_quantity || 1)
        })),
        commercialText: "Estas são as melhores opções para você no momento.",
        confidenceNotes: ["Modo demonstração"],
        totalEstimated: result.items.reduce((sum, item) => sum + (item.price * (item.suggested_quantity || 1)), 0)
      };
    }

    try {
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-recommendation', {
        body: { 
          storeId, 
          prompt, 
          mode, 
          quoteStyle, 
          refinement 
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error calling generate-recommendation:', error);
      
      // Local fallback if Edge Function fails
      // Fetch some products to make the fallback feel real
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('active', true)
        .gt('stock_quantity', 0)
        .limit(3);

      return this.generateLocalFallback(prompt, products || []);
    }
  },

  /**
   * Deterministic local fallback when API fails
   */
  generateLocalFallback(prompt, products) {
    const items = products.map(p => ({
      productId: p.id,
      name: p.name,
      price: p.price,
      image_url: p.image_url,
      quantity: 1,
      reason: "Selecionamos este produto baseado na disponibilidade imediata.",
      personalizedReason: "Uma excelente opção do nosso catálogo.",
      priority: "medium",
      subtotal: p.price
    }));

    return {
      interpretedNeed: {
        summary: "Sugestão baseada nos produtos em destaque.",
        audience: "Geral",
        preferences: []
      },
      recommendationSummary: "Montamos uma seleção automática com os produtos disponíveis no momento.",
      items,
      commercialText: "O que achou destas sugestões?",
      confidenceNotes: ["Fallback automático devido a erro na conexão com IA"],
      totalEstimated: items.reduce((sum, i) => sum + i.subtotal, 0)
    };
  }
};
