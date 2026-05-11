import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, RotateCcw, Send, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuggestionChip from '@/components/shared/SuggestionChip';
import AILoadingSteps from '@/components/ai/AILoadingSteps';
import RecommendationCard from '@/components/ai/RecommendationCard';
import ProposalBuilder from '@/components/proposal/ProposalBuilder';
import { simulateAIRecommendation } from '@/lib/demoData';

const SUGGESTIONS = [
    "Presente infantil para meninas", "Kit até R$ 100", "Produtos premium",
    "Mais vendidos", "Alta margem", "Produtos com estoque alto",
    "Presente feminino", "Presente masculino", "Cliente indeciso", "Primeira compra",
];

const STEP_ICONS = ['1', '2', '3'];
const STEP_LABELS = ['Pedido', 'Recomendações', 'Proposta'];

export default function Generate() {
    const [prompt, setPrompt] = useState('');
    const [step, setStep] = useState('input'); // input | loading | results | proposal
    const [recommendation, setRecommendation] = useState(null);
    const [addedIds, setAddedIds] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [refinePrompt, setRefinePrompt] = useState('');
    const textareaRef = useRef(null);

    const currentStepNum = step === 'input' ? 0 : step === 'loading' ? 0 : step === 'results' ? 1 : 2;

    function handleChip(label) {
        const map = {
            "Presente infantil para meninas": "Quero produtos para meninas de 6 a 10 anos, até R$ 250, para presente.",
            "Kit até R$ 100": "Preciso montar um kit completo de produtos até R$ 100.",
            "Produtos premium": "Quero produtos premium de alta qualidade para presente especial.",
            "Mais vendidos": "Mostre os produtos mais vendidos do catálogo.",
            "Alta margem": "Quero produtos com alta margem para revenda.",
            "Produtos com estoque alto": "Mostre produtos com bastante estoque disponível.",
            "Presente feminino": "Quero sugestões de presentes para mulheres adultas.",
            "Presente masculino": "Quero sugestões de presentes para homens adultos.",
            "Cliente indeciso": "Cliente indeciso, quer algo útil e bonito até R$ 150.",
            "Primeira compra": "Cliente fazendo a primeira compra, quer produtos acessíveis e populares.",
        };
        setPrompt(map[label] || label);
        textareaRef.current?.focus();
    }

    function handleGenerate(p) {
        const text = p || prompt;
        if (!text.trim()) return;
        setStep('loading');
        setAddedIds([]);
        setSelectedItems([]);
    }

    function handleLoadingDone() {
        const result = simulateAIRecommendation(prompt);
        setRecommendation(result);
        setStep('results');
    }

    function handleAdd(product) {
        if (addedIds.includes(product.id)) return;
        setAddedIds(prev => [...prev, product.id]);
        setSelectedItems(prev => [...prev, {
            product_id: product.id, product_name: product.name,
            product_image: product.image_url, quantity: 1,
            unit_price: product.price, total: product.price,
            reason: product.reason, compatibility_score: product.compatibility_score
        }]);
    }

    function handleAddAll() {
        recommendation.items.forEach(p => { if (!addedIds.includes(p.id)) handleAdd(p); });
    }

    function handleRefine() {
        if (!refinePrompt.trim()) return;
        setPrompt(prev => prev + ". " + refinePrompt);
        setRefinePrompt('');
        setStep('loading');
        setAddedIds([]);
        setSelectedItems([]);
    }

    function handleGoToProposal() {
        if (selectedItems.length === 0) handleAddAll();
        setStep('proposal');
    }

    function handleReset() {
        setStep('input');
        setPrompt('');
        setRecommendation(null);
        setAddedIds([]);
        setSelectedItems([]);
    }

    // Step indicator
    const StepBar = () => (
        <div className="flex items-center gap-0 mb-8 max-w-sm mx-auto">
            {STEP_LABELS.map((label, i) => (
                <React.Fragment key={label}>
                    <div className="flex flex-col items-center gap-1 flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= currentStepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            }`}>{i + 1}</div>
                        <span className={`text-[10px] font-medium ${i === currentStepNum ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                        <div className={`h-[2px] flex-1 mb-4 transition-all ${i < currentStepNum ? 'bg-primary' : 'bg-border'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    // -------- INPUT STEP --------
    if (step === 'input') return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-primary bg-accent px-3 py-1.5 rounded-full mb-4">
                    <Sparkles className="w-3 h-3" /> IA Comercial
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">O que seu cliente está procurando?</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    Descreva a necessidade em linguagem natural. A IA consulta seu catálogo<br className="hidden sm:block" /> e recomenda os melhores produtos disponíveis.
                </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm mb-4">
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
                    placeholder="Ex: Quero produtos para crianças de 6 a 10 anos, meninas, até R$ 250, para presente."
                    className="w-full text-sm text-foreground bg-transparent border-none outline-none resize-none min-h-[100px] placeholder:text-muted-foreground/60"
                    rows={4}
                />
                <div className="flex items-center justify-between border-t border-border pt-3 mt-2">
                    <span className="text-[11px] text-muted-foreground">Ctrl+Enter para enviar</span>
                    <Button
                        onClick={() => handleGenerate()}
                        disabled={!prompt.trim()}
                        size="sm"
                        className="gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Encontrar produtos com IA
                        <ArrowRight className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => <SuggestionChip key={s} label={s} onClick={handleChip} />)}
            </div>
        </div>
    );

    // -------- LOADING STEP --------
    if (step === 'loading') return (
        <div className="max-w-lg mx-auto">
            <StepBar />
            <AILoadingSteps onDone={handleLoadingDone} />
        </div>
    );

    // -------- RESULTS STEP --------
    if (step === 'results') return (
        <div className="max-w-5xl mx-auto">
            <StepBar />

            {/* AI Summary */}
            <div className="bg-accent/60 border border-primary/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground mb-2">{recommendation?.summary}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {(recommendation?.detectedFilters || []).map(f => (
                                <span key={f.label} className="inline-flex text-xs bg-primary/10 text-primary font-medium px-2.5 py-0.5 rounded-full">
                                    {f.label}: {f.value}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions top */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h2 className="font-semibold text-foreground">{recommendation?.items?.length} produtos recomendados</h2>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={handleReset} className="gap-1">
                        <RotateCcw className="w-3 h-3" /> Nova busca
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleAddAll}>Adicionar todos</Button>
                    {selectedItems.length > 0 && (
                        <Button size="sm" onClick={handleGoToProposal} className="gap-1">
                            Gerar proposta ({selectedItems.length}) <ArrowRight className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {recommendation?.items?.map(p => (
                    <RecommendationCard
                        key={p.id}
                        product={p}
                        onAdd={handleAdd}
                        added={addedIds.includes(p.id)}
                    />
                ))}
            </div>

            {/* Refine */}
            <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-sm font-medium text-foreground mb-3">Quer ajustar a recomendação?</p>
                <div className="flex gap-2">
                    <input
                        value={refinePrompt}
                        onChange={e => setRefinePrompt(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleRefine(); }}
                        placeholder="Ex: Mostre opções mais baratas, remova produtos sem estoque..."
                        className="flex-1 text-sm bg-muted/50 border border-border rounded-lg px-3 py-2 outline-none focus:border-primary"
                    />
                    <Button size="sm" onClick={handleRefine} disabled={!refinePrompt.trim()} className="gap-1">
                        <Send className="w-3.5 h-3.5" /> Refinar
                    </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {["Mostre opções mais baratas", "Priorize produtos premium", "Quero algo mais educativo", "Quero opções para revenda"].map(s => (
                        <button key={s} onClick={() => setRefinePrompt(s)} className="text-xs text-muted-foreground hover:text-primary border border-border hover:border-primary/40 rounded-full px-2.5 py-1 transition-colors">
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {selectedItems.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button size="lg" onClick={handleGoToProposal} className="shadow-lg gap-2">
                        <FileText className="w-4 h-4" />
                        Gerar proposta com {selectedItems.length} {selectedItems.length === 1 ? 'produto' : 'produtos'}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );

    // -------- PROPOSAL STEP --------
    if (step === 'proposal') return (
        <ProposalBuilder
            items={selectedItems}
            prompt={prompt}
            recommendation={recommendation}
            onReset={handleReset}
            onBack={() => setStep('results')}
        />
    );

    return null;
}