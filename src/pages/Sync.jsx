import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { RefreshCw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { toast } from 'sonner';

export default function Sync() {
    const qc = useQueryClient();
    const { data: logs = [], isLoading } = useQuery({
        queryKey: ['sync-logs'],
        queryFn: () => base44.entities.SyncLog.list('-created_date'),
    });

    const simulateSync = useMutation({
        mutationFn: (provider) => base44.entities.SyncLog.create({
            provider,
            status: 'success',
            message: `Sincronização simulada de ${provider === 'bling' ? 'Bling' : 'Nuvemshop'} concluída com sucesso.`,
            total_items: 20,
            success_items: 18,
            failed_items: 2,
            started_at: new Date().toISOString(),
            finished_at: new Date().toISOString(),
        }),
        onSuccess: (_, provider) => {
            qc.invalidateQueries({ queryKey: ['sync-logs'] });
            toast.success(`Sincronização ${provider === 'bling' ? 'Bling' : 'Nuvemshop'} simulada com sucesso!`);
        },
    });

    const successLogs = logs.filter(l => l.status === 'success').length;
    const errorLogs = logs.filter(l => l.status === 'error').length;

    return (
        <div className="space-y-6">
            <PageHeader title="Sincronização" subtitle="Acompanhe o histórico de sincronizações com integrações externas.">
                <Button variant="outline" size="sm" onClick={() => simulateSync.mutate('bling')} className="gap-1.5" disabled={simulateSync.isPending}>
                    <RefreshCw className="w-4 h-4" /> Simular Bling
                </Button>
                <Button variant="outline" size="sm" onClick={() => simulateSync.mutate('nuvemshop')} className="gap-1.5" disabled={simulateSync.isPending}>
                    <RefreshCw className="w-4 h-4" /> Simular Nuvemshop
                </Button>
            </PageHeader>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total de Sincronizações" value={logs.length} icon={RefreshCw} />
                <StatCard title="Bem Sucedidas" value={successLogs} icon={CheckCircle} />
                <StatCard title="Com Erros" value={errorLogs} icon={AlertTriangle} />
                <StatCard title="Última Execução" value={logs[0] ? new Date(logs[0].created_date).toLocaleDateString('pt-BR') : '—'} icon={Clock} />
            </div>

            {logs.length === 0 ? (
                <EmptyState icon={RefreshCw} title="Nenhuma sincronização realizada" description="Simule uma sincronização para testar o sistema." />
            ) : (
                <Card>
                    <CardHeader><CardTitle className="text-sm">Histórico de Sincronizações</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Provedor</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Sucesso</TableHead>
                                    <TableHead>Falha</TableHead>
                                    <TableHead>Mensagem</TableHead>
                                    <TableHead>Data</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map(log => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium capitalize">{log.provider}</TableCell>
                                        <TableCell><StatusBadge status={log.status} /></TableCell>
                                        <TableCell>{log.total_items}</TableCell>
                                        <TableCell className="text-green-600">{log.success_items}</TableCell>
                                        <TableCell className="text-destructive">{log.failed_items}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.message}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{new Date(log.created_date).toLocaleDateString('pt-BR')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}