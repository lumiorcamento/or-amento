import React, { useState, useEffect } from 'react';
import { Sparkles, LogOut, Clock, AlertCircle, Loader2, RefreshCw, ShoppingBag } from 'lucide-react';
import { useBuyer } from '@/lib/BuyerContext';
import { useStore } from '@/lib/StoreContext';
import { Link } from 'react-router-dom';
import BuyerLogin from './BuyerLogin';
import StepInput from '@/components/assistant/StepInput';
import StepLoading from '@/components/assistant/StepLoading';
import StepResults from '@/components/assistant/StepResults';
import StepReview from '@/components/assistant/StepReview';
import StepContact from '@/components/assistant/StepContact';
import StepSuccess from '@/components/assistant/StepSuccess';
import { productService, quoteService, recommendationService } from '@/services';
import { isSupabaseConfigured } from '@/lib/supabase';
import { toast } from 'sonner';

export default function QuoteAssistant() {
    const { buyer, buyerProfile, signOut, isLoadingBuyer, isBuyerAuthenticated, refreshBuyerProfile } = useBuyer();
    const { store, isLoadingStore, storeError, storeSlug } = useStore();

    const [step, setStep] = useState('input');
    const [prompt, setPrompt] = useState('');
    const [recommendation, setRecommendation] = useState(null);
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [contact, setContact] = useState({ name: '', contact: '', company: '', notes: '', consent: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedQuoteData, setSavedQuoteData] = useState(null);
    const [safetyTimeoutTriggered, setSafetyTimeoutTriggered] = useState(false);
    
    const [initialPrompt, setInitialPrompt] = useState(() => {
        const saved = sessionStorage.getItem('lumi_initial_prompt');
        if (saved) { sessionStorage.removeItem('lumi_initial_prompt'); return saved; }
        return '';
    });

    // 1. Store Resolution MUST come first and be independent
    // 2. Safety Timeout
    useEffect(() => {
        if (isLoadingStore) {
            const timer = setTimeout(() => setSafetyTimeoutTriggered(true), 10000);
            return () => clearTimeout(timer);
        }
    }, [isLoadingStore]);

    // 3. Load products once store is resolved
    useEffect(() => {
        async function loadProducts() {
            if (store?.id) {
                try {
                    setIsLoadingProducts(true);
                    const data = await productService.getActiveProductsByStore(store.id);
                    setProducts(data || []);
                    if (isBuyerAuthenticated) {
                        refreshBuyerProfile(store.id);
                    }
                } catch (err) {
                    console.error("[QuoteAssistant] Catalog load failed:", err);
                } finally {
                    setIsLoadingProducts(false);
                }
            }
        }
        loadProducts();
    }, [store?.id, isBuyerAuthenticated, refreshBuyerProfile]);

    // RENDER LOGIC
    
    // Safety Timeout Screen
    if (safetyTimeoutTriggered && isLoadingStore) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 text-center">
                <div className="max-w-sm">
                    <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <h1 className="text-lg font-bold text-gray-900 mb-2">Não conseguimos carregar a experiência desta loja</h1>
                    <p className="text-sm text-gray-500 mb-6">Verifique sua conexão ou tente novamente.</p>
                    <button onClick={() => window.location.reload()} className="flex items-center gap-2 mx-auto bg-green-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-800 transition-colors shadow-lg shadow-green-100">
                        <RefreshCw className="w-4 h-4" /> Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    // A. Wait for Store First
    if (isLoadingStore) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-green-700 animate-spin" />
                    <p className="text-xs text-gray-400">Carregando experiência...</p>
                </div>
            </div>
        );
    }

    // B. Handle Store Error
    if (storeError || !store) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 text-center">
                <div className="max-w-sm">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h1 className="text-lg font-bold text-gray-900 mb-2">{storeError || 'Loja não encontrada'}</h1>
                    <p className="text-sm text-gray-500 mb-6">O endereço solicitado não existe ou está temporariamente indisponível.</p>
                    <Link to="/" className="text-sm font-semibold text-green-700 hover:text-green-800">Voltar ao início</Link>
                </div>
            </div>
        );
    }

    // C. Store resolved. Now handle Buyer (OPTIONAL for public page)
    // If buyer is still loading, we can show a small indicator or just wait if we REALLY need it.
    // But per requirement 3, we should render the public experience even if buyer is loading.
    
    // D. Auth gate (Optional check - can be skipped for public view if allowed)
    if (!isLoadingBuyer && !isBuyerAuthenticated) {
        return <BuyerLogin />;
    }

    // Pre-fill contact
    if (contact.name === '' && buyer?.name) {
        setContact(prev => ({ ...prev, name: buyer.name, contact: buyer.phone || buyer.email || '' }));
    }

    const steps = ['Pedido', 'Sugestões', 'Revisão', 'Envio'];
    const stepIndex = { input: 0, loading: 0, results: 1, review: 2, contact: 3, success: 3 }[step] ?? 0;

    async function handleGenerate(text) {
        if (products.length === 0 && !isLoadingProducts) {
            toast.error("Catálogo ainda não sincronizado.");
            return;
        }
        setPrompt(text);
        setStep('loading');
    }

    async function handleLoadingDone() {
        try {
            const result = await recommendationService.generateRecommendation({
                storeId: store.id,
                prompt,
                buyerProfile: { ...buyer, profile: buyerProfile },
                mode: 'recommended'
            });

            if (!result || !result.items || result.items.length === 0) {
                toast.error("Não encontramos produtos correspondentes.");
                setStep('input');
                return;
            }

            setRecommendation(result);
            setItems(result.items.map(p => ({ ...p, quantity: p.quantity || 1 })));
            setStep('results');
        } catch (err) {
            console.error("[QuoteAssistant] recommendation error:", err);
            toast.error("Erro ao gerar recomendações. Tente novamente.");
            setStep('input');
        }
    }

    async function handleSubmit() {
        setIsSubmitting(true);
        try {
            const payload = {
                storeId: store.id,
                originalPrompt: prompt,
                interpretedNeed: recommendation?.interpretedNeed || {},
                items: items.map(i => ({
                    productId: i.productId || i.id,
                    quantity: i.quantity,
                    reason: i.reason,
                    personalizedReason: i.personalizedReason
                })),
                contact: {
                    name: contact.name,
                    email: contact.contact.includes('@') ? contact.contact : buyer.email,
                    phone: !contact.contact.includes('@') ? contact.contact : buyer.phone,
                    consent: contact.consent
                }
            };

            const result = await quoteService.createQuoteRequest(payload);
            setSavedQuoteData(result);
            setStep('success');
            toast.success("Orçamento enviado!");
        } catch (err) {
            console.error("[QuoteAssistant] submission error:", err);
            toast.error("Falha ao enviar orçamento.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleReset() {
        setStep('input');
        setPrompt('');
        setRecommendation(null);
        setItems([]);
        setInitialPrompt('');
        setSavedQuoteData(null);
    }

    function calcTotal() {
        return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: store.primary_color || store.primaryColor || '#059669' }}>
                        {store.logo_url ? (
                            <img src={store.logo_url} alt={store.name} className="w-full h-full object-contain rounded-lg" />
                        ) : (
                            <Sparkles className="w-4 h-4 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 leading-none">Orçamento para</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{store.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isSupabaseConfigured() && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full hidden sm:block">Demonstração</span>
                    )}
                    <Link to={`/s/${storeSlug}/historico`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Histórico</span>
                    </Link>
                    <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-auto">
                {products.length === 0 && !isLoadingProducts && step === 'input' && (
                    <div className="max-w-2xl mx-auto mt-8 px-6">
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
                            <ShoppingBag className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                            <h3 className="text-amber-900 font-bold mb-1">Catálogo ainda não sincronizado</h3>
                            <p className="text-amber-800 text-sm">
                                O lojista precisa conectar o Bling para importar os produtos.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'input' && (
                    <StepInput
                        onGenerate={handleGenerate}
                        buyer={buyer}
                        initialPrompt={initialPrompt}
                        disabled={products.length === 0 && !isLoadingProducts}
                    />
                )}
                {step === 'loading' && <StepLoading onDone={handleLoadingDone} hasHistory={!!buyerProfile} />}
                {step === 'results' && <StepResults prompt={prompt} recommendation={recommendation} items={items} setItems={setItems} onReset={handleReset} onRefine={handleGenerate} onNext={() => setStep('review')} />}
                {step === 'review' && <StepReview prompt={prompt} items={items} setItems={setItems} total={calcTotal()} onBack={() => setStep('results')} onNext={() => setStep('contact')} />}
                {step === 'contact' && <StepContact contact={contact} setContact={setContact} items={items} total={calcTotal()} onBack={() => setStep('review')} onSubmit={handleSubmit} buyer={buyer} isSubmitting={isSubmitting} />}
                {step === 'success' && <StepSuccess quoteId={savedQuoteData?.id} items={items} total={calcTotal()} contact={contact} onReset={handleReset} storeName={store.name} />}
            </main>
        </div>
    );
}