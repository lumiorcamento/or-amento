import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function PageNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <p className="text-6xl font-bold text-green-700">404</p>
                <h1 className="text-xl font-semibold text-gray-900">Página não encontrada</h1>
                <p className="text-sm text-gray-500">A página que você está procurando não existe.</p>
                <Link to="/"><Button className="gap-1.5 mt-2 bg-green-700 hover:bg-green-800"><Sparkles className="w-4 h-4" />Montar orçamento</Button></Link>
            </div>
        </div>
    );
}