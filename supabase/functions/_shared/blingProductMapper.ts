/**
 * Maps Bling Product API response to Supabase products table
 */
export function mapBlingProductToSupabaseProduct(blingProduct: any, storeId: string) {
  // Bling v3 return structure varies, but usually it's under 'data' or the object itself
  const p = blingProduct;

  return {
    store_id: storeId,
    external_id: String(p.id),
    source: 'bling',
    sku: p.codigo || '',
    name: p.nome || 'Produto Sem Nome',
    description: p.descricaoCurta || p.descricao || '',
    price: Number(p.preco) || 0,
    stock_quantity: Number(p.estoque?.saldoVirtual || p.estoque?.saldoTotal) || 0,
    image_url: p.midia?.video?.url || p.midia?.imagens?.externas?.[0]?.link || p.midia?.imagens?.internas?.[0]?.link || '',
    category: p.categoria?.nome || '',
    // We don't overwrite these if they already exist in the database (handled in the sync function)
    active: p.situacao === 'A' ? true : (p.situacao === 'I' ? false : true),
    raw_data: {
      bling_id: p.id,
      tipo: p.tipo,
      unidade: p.unidade,
      original_situacao: p.situacao
    },
    last_synced_at: new Error().toISOString() // Handled by calling function usually
  };
}
