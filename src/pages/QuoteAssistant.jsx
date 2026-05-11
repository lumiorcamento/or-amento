import React, { useState, useEffect } from 'react';
import { Sparkles, LogOut, Clock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useBuyer } from '@/lib/BuyerContext';
import { useStore } from '@/lib/StoreContext';
import { Link, useParams } from 'react-router-dom';
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
    const { store, isLoadingStore, storeError } = useStore();
    const { storeSlug } = useParams();

    const [step, setStep] = useState('input');
    const [prompt, setPrompt] = useState('');
    const [recommendation, setRecommendation] = useState(null);
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [contact, setContact] = useState({ name: '', contact: '', company: '', notes: '', consent: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedQuoteData, setSavedQuoteData] = useState(null);
    
    const [initialPrompt, setInitialPrompt] = useState(() => {
        const saved = sessionStorage.getItem('lumi_initial_prompt');
        if (saved) { sessionStorage.removeItem('lumi_initial_prompt'); return saved; }
        return '';
    });

    // Load store products
    useEffect(() => {
        async function loadProducts() {
            if (store) {
                try {
                    const data = await productService.getActiveProductsByStore(store.id);
                    setProducts(data);
                    if (isBuyerAuthenticated) {
                        refreshBuyerProfile(store.id);
                    }
                } catch (err) {
                    console.error("Error loading products:", err);
                }
            }
        }
        loadProducts();
    }, [store, isBuyerAuthenticated]);

    // Loading states
    if (isLoadingStore || isLoadingBuyer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-green-700 animate-spin" />
                    <p className="text-xs text-gray-400">Carregando experiência...</p>
                </div>
            </div>
        );
    }

    // Error states
    if (storeError || !store) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 text-center">
                <div className="max-w-sm">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h1 className="text-lg font-bold text-gray-900 mb-2">{storeError || 'Loja não encontrada'}</h1>
                    <p className="text-sm text-gray-500 mb-6">Verifique o endereço digitado ou entre em contato com o suporte.</p>
                    <Link to="/" className="text-sm font-semibold text-green-700 hover:text-green-800">Voltar ao início</Link>
                </div>
            </div>
        );
    }

    // Auth gate
    if (!isBuyerAuthenticated) {
        return <BuyerLogin />;
    }

    // Pre-fill contact from buyer on first load
    if (contact.name === '' && buyer?.name) {
        setContact(prev => ({ ...prev, name: buyer.name, contact: buyer.phone || buyer.email || '' }));
    }

    const steps = ['Pedido', 'Sugestões', 'Revisão', 'Envio'];
    const stepIndex = { input: 0, loading: 0, results: 1, review: 2, contact: 3, success: 3 }[step] ?? 0;

    async function handleGenerate(text) {
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
            setRecommendation(result);
            setItems(result.items.map(p => ({ ...p, quantity: p.quantity || 1 })));
            setStep('results');
        } catch (err) {
            console.error("Recommendation error:", err);
            toast.error("Erro ao gerar recomendações. Tente um pedido mais simples.");
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
            toast.success("Orçamento enviado com sucesso!");
        } catch (err) {
            console.error("Submission error:", err);
            toast.error("Não conseguimos enviar seu orçamento agora. Tente novamente.");
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
            {/* Store header */}
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: store.primary_color || store.primaryColor }}>
                        {store.logo_url ? (
                            <img src={store.logo_url} alt={store.name} className="w-full h-full object-contain rounded-lg" />
                        ) : (
                            <Sparkles className="w-4 h-4 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] text-gray-400 leading-none">Orçamento personalizado para</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">{store.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!isSupabaseConfigured() && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full hidden sm:block">Modo demonstração</span>
                    )}
                    {/* Buyer menu */}
                    <Link to={`/s/${storeSlug}/historico`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Meus orçamentos</span>
                    </Link>
                    <Link to={`/s/${storeSlug}/preferencias`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                        <User className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{buyer?.name?.split(' ')[0] || 'Perfil'}</span>
                    </Link>
                    <button onClick={signOut} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Sair">
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                    <Link to="/lojista" className="text-xs text-gray-400 hover:text-gray-600 transition-colors hidden sm:block pl-1 border-l border-gray-200 ml-1">Sou lojista →</Link>
                </div>
            </header>

            {/* Step indicator */}
            {step !== 'input' && step !== 'success' && (
                <div className="bg-white border-b border-gray-100 px-4 py-2.5">
                    <div className="max-w-2xl mx-auto flex items-center gap-0">
                        {steps.map((label, i) => (
                            <React.Fragment key={label}>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${i < stepIndex ? 'bg-green-600 text-white' : i === stepIndex ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-400'
                                        }`}>{i < stepIndex ? '✓' : i + 1}</div>
                                    <span className={`text-[11px] font-medium hidden sm:block ${i === stepIndex ? 'text-green-700' : i < stepIndex ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
                                </div>
                                {i < steps.length - 1 && <div className={`h-px flex-1 mx-2 ${i < stepIndex ? 'bg-green-400' : 'bg-gray-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                {step === 'input' && (
                    <StepInput
                        onGenerate={handleGenerate}
                        buyer={buyer}
                        initialPrompt={initialPrompt}
                    />
                )}
                {step === 'loading' && (
                    <StepLoading
                        onDone={handleLoadingDone}
                        hasHistory={(buyer?.history?.length > 0) || !!buyerProfile}
                    />
                )}
                {step === 'results' && (
                    <StepResults
                        prompt={prompt}
                        recommendation={recommendation}
                        items={items}
                        setItems={setItems}
                        onReset={handleReset}
                        onRefine={handleGenerate}
                        onNext={() => setStep('review')}
                    />
                )}
                {step === 'review' && (
                    <StepReview
                        prompt={prompt}
                        items={items}
                        setItems={setItems}
                        total={calcTotal()}
                        onBack={() => setStep('results')}
                        onNext={() => setStep('contact')}
                    />
                )}
                {step === 'contact' && (
                    <StepContact
                        contact={contact}
                        setContact={setContact}
                        items={items}
                        total={calcTotal()}
                        onBack={() => setStep('review')}
                        onSubmit={handleSubmit}
                        buyer={buyer}
                        isSubmitting={isSubmitting}
                    />
                )}
                {step === 'success' && (
                    <StepSuccess
                        quoteId={savedQuoteData?.quote_request_id || savedQuoteData?.id}
                        items={items}
                        total={savedQuoteData?.estimated_total || calcTotal()}
                        contact={contact}
                        onReset={handleReset}
                        storeName={store.name}
                    />
                )}
            </main>
        </div>
    );
}