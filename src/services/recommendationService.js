import { simulateAIRecommendationWithHistory } from "@/lib/buyerData";
import { DEMO_PRODUCTS } from "@/lib/demoData";

/**
 * Service for recommendation logic
 * Currently uses the mocked simulation engine from buyerData.js
 */
export const recommendationService = {
  /**
   * Interprets the user prompt (Mocked)
   */
  async interpretPrompt(prompt) {
    // Simulated interpretation for the mock engine
    return {
      summary: "Interpretação simulada do pedido",
      intent: "general",
      budget: null,
      audience: "geral",
      useCase: "uso variado"
    };
  },

  /**
   * Generates a recommendation based on prompt and products
   */
  async generateRecommendation({ prompt, products, buyerProfile }) {
    // Reusing the logic from the prototype but adapting to the new contract
    const result = simulateAIRecommendationWithHistory(
      prompt,
      buyerProfile || { name: 'Visitante' },
      products || DEMO_PRODUCTS
    );

    // Adapting to the new expected structure for Phase 3
    return {
      interpretedNeed: {
        summary: result.reasoning || "Interpretação do pedido",
        audience: result.targetAudience || "Geral",
        ageRange: result.ageRange || "Variada",
        budget: result.budgetCategory || "Médio",
        useCase: result.useCase || "Presente",
        preferences: result.preferencesFound || []
      },
      recommendationSummary: result.reasoning || "Baseado no seu pedido, selecionamos os melhores itens.",
      items: result.items.map(item => ({
        productId: item.id,
        name: item.name, // Extra for UI convenience
        price: item.price, // Extra for UI convenience
        image_url: item.image_url, // Extra for UI convenience
        quantity: item.suggested_quantity || 1,
        reason: item.reason,
        personalizedReason: item.personalized_reason || `Escolhemos o ${item.name} porque combina com o que você procura.`,
        priority: "high"
      })),
      commercialText: "Estes produtos são os mais indicados para sua necessidade no momento.",
      confidenceNotes: ["Baseado em estoque disponível", "Alta compatibilidade com o pedido"]
    };
  },

  /**
   * Validates if recommended products still exist and have stock
   */
  validateRecommendation({ recommendation, products }) {
    const validItems = recommendation.items.filter(recItem => {
      const product = products.find(p => p.id === recItem.productId);
      return product && product.active && (product.stock_quantity > 0 || product.stock_quantity === undefined);
    });

    return {
      ...recommendation,
      items: validItems
    };
  }
};
