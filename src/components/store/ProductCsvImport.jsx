import React, { useState } from 'react';
import Papa from 'papaparse';
import { 
    X, Upload, FileText, CheckCircle, AlertTriangle, 
    Loader2, Download, Table, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

const COLUMN_MAPPING = {
    // English -> Database
    'name': 'name',
    'sku': 'sku',
    'description': 'description',
    'price': 'price',
    'stock_quantity': 'stock_quantity',
    'image_url': 'image_url',
    'category': 'category',
    'tags': 'tags',
    'target_audience': 'target_audience',
    'age_range': 'age_range',
    'use_case': 'use_case',
    'active': 'active',
    // Portuguese -> Database
    'nome': 'name',
    'codigo': 'sku',
    'descricao': 'description',
    'preco': 'price',
    'estoque': 'stock_quantity',
    'imagem': 'image_url',
    'publico': 'target_audience',
    'faixa_etaria': 'age_range',
    'uso': 'use_case',
    'ativo': 'active'
};

export default function ProductCsvImport({ onImport, onCancel, isLoading }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isParsing, setIsParsing] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);
        }
    };

    const parseFile = (file) => {
        setIsParsing(true);
        setErrors([]);
        
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const mappedData = results.data.map((row, index) => {
                    const normalizedRow = {};
                    const rowErrors = [];

                    // Map columns
                    Object.keys(row).forEach(key => {
                        const normalizedKey = key.toLowerCase().trim();
                        const dbField = COLUMN_MAPPING[normalizedKey] || normalizedKey;
                        
                        let value = row[key];
                        
                        // Basic conversions
                        if (dbField === 'price') value = parseFloat(value.toString().replace(',', '.')) || 0;
                        if (dbField === 'stock_quantity') value = parseInt(value) || 0;
                        if (dbField === 'active') value = value?.toString().toLowerCase() === 'true' || value === '1' || value === 'sim';
                        if (dbField === 'tags') value = value?.split(/[,;]/).map(t => t.trim()).filter(Boolean) || [];

                        normalizedRow[dbField] = value;
                    });

                    // Validation
                    if (!normalizedRow.name) rowErrors.push(`Linha ${index + 1}: Nome é obrigatório.`);
                    if (isNaN(normalizedRow.price)) rowErrors.push(`Linha ${index + 1}: Preço inválido.`);

                    return { data: normalizedRow, errors: rowErrors };
                });

                const allErrors = mappedData.flatMap(m => m.errors);
                setPreview(mappedData.map(m => m.data));
                setErrors(allErrors);
                setIsParsing(false);
            },
            error: (err) => {
                toast.error("Erro ao ler o arquivo CSV.");
                setIsParsing(false);
            }
        });
    };

    const handleDownloadTemplate = () => {
        const headers = "name,sku,description,price,stock_quantity,image_url,category,tags,target_audience,age_range,use_case,active\n";
        const example = "Kit Criativo,KIT-001,Kit com itens de papelaria criativa,89.90,20,https://exemplo.com/kit.jpg,Papelaria,\"infantil, escolar, presente\",Crianças,6-10 anos,Presente,true";
        const blob = new Blob([headers + example], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "modelo_produtos_lumi.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center text-white">
                            <Upload className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Importar Produtos</h2>
                            <p className="text-xs text-gray-500">Envie um arquivo CSV para atualizar seu catálogo em massa.</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {!file ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-200">
                                <FileText className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Selecione seu arquivo CSV</h3>
                            <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
                                Use nosso modelo para garantir que as colunas estejam no formato correto para a IA.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                <label className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-4 rounded-2xl cursor-pointer transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2">
                                    <Upload className="w-5 h-5" /> Selecionar Arquivo
                                    <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                                </label>
                                <button 
                                    onClick={handleDownloadTemplate}
                                    className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" /> Baixar Modelo
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                                        <Table className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Encontrados</p>
                                        <p className="text-lg font-black text-gray-900">{preview.length} itens</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-green-700 uppercase">Válidos</p>
                                        <p className="text-lg font-black text-green-900">{preview.length - errors.length} itens</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 shadow-sm">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-red-700 uppercase">Com Erro</p>
                                        <p className="text-lg font-black text-red-900">{errors.length} itens</p>
                                    </div>
                                </div>
                            </div>

                            {errors.length > 0 && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-2">
                                    <p className="text-xs font-bold text-red-800 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Corrija os erros abaixo no seu arquivo:
                                    </p>
                                    <div className="max-h-32 overflow-y-auto space-y-1">
                                        {errors.map((err, i) => (
                                            <p key={i} className="text-[11px] text-red-600">• {err}</p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Preview Table */}
                            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Visualização dos primeiros 5 itens
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-gray-50/30">
                                            <tr>
                                                <th className="px-4 py-3 font-bold text-gray-500">Nome</th>
                                                <th className="px-4 py-3 font-bold text-gray-500">SKU</th>
                                                <th className="px-4 py-3 font-bold text-gray-500">Preço</th>
                                                <th className="px-4 py-3 font-bold text-gray-500">Tags</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {preview.slice(0, 5).map((row, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                                                    <td className="px-4 py-3 text-gray-500">{row.sku}</td>
                                                    <td className="px-4 py-3 font-bold text-green-700">R$ {row.price?.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-gray-400 italic line-clamp-1">{Array.isArray(row.tags) ? row.tags.join(', ') : ''}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <button 
                                onClick={() => { setFile(null); setPreview([]); setErrors([]); }}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Selecionar outro arquivo
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                    <button 
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        disabled={!file || errors.length > 0 || isLoading || isParsing}
                        onClick={() => onImport(preview)}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-green-900/20 flex items-center gap-2 disabled:opacity-40"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Confirmar Importação</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
