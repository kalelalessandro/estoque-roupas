import { useCallback, useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboard';
import { useRealtime } from '../hooks/useRealtime';
import { DashboardSummary } from '../types';

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    dashboardApi
      .summary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(load);

  if (loading) {
    return <p className="text-sm text-ink/50">Carregando...</p>;
  }

  if (!summary) {
    return <p className="text-sm text-danger">Não foi possível carregar o dashboard.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-ink/50">Visão geral do estoque da loja</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
            Total de produtos
          </p>
          <p className="mt-2 font-mono text-3xl font-medium text-ink">{summary.totalProducts}</p>
        </div>
        <div className="card p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
            Vendas realizadas
          </p>
          <p className="mt-2 font-mono text-3xl font-medium text-ink">{summary.totalSales}</p>
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Estoque baixo</p>
          <span className="text-xs text-ink/40">
            quantidade ≤ {summary.lowStockThreshold} unidades
          </span>
        </div>

        {summary.lowStockProducts.length === 0 ? (
          <p className="text-sm text-ink/50">Nenhum produto com estoque baixo no momento.</p>
        ) : (
          <ul className="divide-y divide-line/70">
            {summary.lowStockProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="ml-2 font-mono text-xs text-ink/40">{p.sku}</span>
                </div>
                <span className="font-mono text-danger">{p.quantity} un.</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
