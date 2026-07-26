import { AlertTriangle, PackageCheck, ReceiptText, Tags } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { dashboardApi } from '../api/dashboard';
import { PageHeader } from '../components/ui/PageHeader';
import { useRealtime } from '../hooks/useRealtime';
import { DashboardSummary } from '../types';

function StatCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="skeleton h-3 w-28" />
      <div className="skeleton mt-4 h-8 w-16" />
    </div>
  );
}

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  const load = useCallback(() => {
    dashboardApi
      .summary()
      .then((data) => {
        setSummary(data);
        setErrored(false);
      })
      .catch(() => setErrored(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(load);

  if (errored) {
    return (
      <div className="card flex flex-col items-center gap-3 p-12 text-center animate-fade-in">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle size={20} />
        </div>
        <p className="text-sm font-medium text-ink/70">Não foi possível carregar o dashboard.</p>
        <button onClick={load} className="btn-secondary mt-1">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Visão geral" title="Dashboard" description="Panorama do estoque e das vendas da loja" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {loading || !summary ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <div className="card-interactive animate-fade-in-up p-6" style={{ animationDelay: '40ms' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xs font-semibold uppercase tracking-wider text-ink/45">
                    Total de produtos
                  </p>
                  <p className="mt-2 font-display text-3xl font-semibold text-ink">{summary.totalProducts}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-dark">
                  <Tags size={18} strokeWidth={2} />
                </div>
              </div>
            </div>
            <div className="card-interactive animate-fade-in-up p-6" style={{ animationDelay: '100ms' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xs font-semibold uppercase tracking-wider text-ink/45">
                    Vendas realizadas
                  </p>
                  <p className="mt-2 font-display text-3xl font-semibold text-ink">{summary.totalSales}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-soft text-gold">
                  <ReceiptText size={18} strokeWidth={2} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="card animate-fade-in-up p-6" style={{ animationDelay: '160ms' }}>
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold text-ink">Estoque baixo</p>
          {summary && (
            <span className="tag-badge">quantidade ≤ {summary.lowStockThreshold} un.</span>
          )}
        </div>
        <div className="stitch-divider my-4" />

        {loading || !summary ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-9 w-full" />
            ))}
          </div>
        ) : summary.lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
              <PackageCheck size={20} />
            </div>
            <p className="text-sm font-medium text-ink/70">Estoque saudável</p>
            <p className="text-sm text-ink/45">Nenhum produto com estoque baixo no momento.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line-soft/80">
            {summary.lowStockProducts.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center justify-between py-3 text-sm animate-fade-in-up"
                style={{ animationDelay: `${200 + i * 40}ms` }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="status-dot bg-danger" />
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="tag-badge">{p.sku}</span>
                </div>
                <span className="font-mono text-sm font-medium text-danger">{p.quantity} un.</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
