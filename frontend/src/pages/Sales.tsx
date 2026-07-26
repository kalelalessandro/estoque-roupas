import { CheckCircle2, Receipt, ShoppingBag } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/products';
import { salesApi } from '../api/sales';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { SkeletonRows } from '../components/ui/SkeletonRows';
import { useToast } from '../components/ui/ToastProvider';
import { useRealtime } from '../hooks/useRealtime';
import { Product, Sale } from '../types';

export function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  const load = useCallback(() => {
    Promise.all([salesApi.list(), productsApi.list()])
      .then(([s, p]) => {
        setSales(s);
        setProducts(p);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(load);

  const selectedProduct = products.find((p) => p.id === productId);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!productId) {
      setError('Selecione um produto');
      return;
    }

    setSaving(true);
    try {
      const sale = await salesApi.create(productId, Number(quantity));
      toast(
        `Venda registrada: ${quantity}x ${sale.product.name} — ${sale.totalPrice.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}`,
      );
      setProductId('');
      setQuantity(1);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível registrar a venda');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Movimentação" title="Vendas" description="Registro manual de vendas e histórico" />

      <div className="card p-6">
        <div className="mb-1 flex items-center gap-2">
          <ShoppingBag size={16} className="text-accent" />
          <h2 className="text-sm font-semibold text-ink">Registrar venda</h2>
        </div>
        <div className="stitch-divider my-4" />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px_auto] sm:items-end">
          <div>
            <label className="label">Produto</label>
            <select
              className="input"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                  {p.name} ({p.sku}) — {p.quantity} em estoque
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Quantidade</label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.quantity ?? undefined}
              className="input"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary h-fit">
            {saving ? 'Registrando...' : 'Registrar venda'}
          </button>
        </form>

        {error && (
          <p className="mt-3 animate-fade-in rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Produto</th>
                <th className="th">SKU</th>
                <th className="th">Qtd.</th>
                <th className="th">Total</th>
                <th className="th">Data</th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonRows columns={5} />}
              {!loading &&
                sales.map((sale, i) => (
                  <tr key={sale.id} className="table-row animate-fade-in" style={{ animationDelay: `${i * 25}ms` }}>
                    <td className="td font-medium">{sale.product.name}</td>
                    <td className="td">
                      <span className="tag-badge">{sale.product.sku}</span>
                    </td>
                    <td className="td font-mono">{sale.quantity}</td>
                    <td className="td font-mono font-medium text-accent-dark">
                      {sale.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="td text-ink/55">{new Date(sale.createdAt).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: card list */}
        <div className="divide-y divide-line-soft/80 md:hidden">
          {loading && (
            <div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2.5 p-4">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              ))}
            </div>
          )}
          {!loading &&
            sales.map((sale, i) => (
              <div
                key={sale.id}
                className="flex items-center justify-between gap-3 animate-fade-in p-4 transition-colors duration-150 active:bg-sunken/60"
                style={{ animationDelay: `${i * 25}ms` }}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{sale.product.name}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="tag-badge">{sale.product.sku}</span>
                    <span className="text-xs text-ink/45">
                      {sale.quantity}x · {new Date(sale.createdAt).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <p className="shrink-0 font-mono text-sm font-medium text-accent-dark">
                  {sale.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            ))}
        </div>

        {!loading && sales.length === 0 && (
          <EmptyState
            icon={Receipt}
            title="Nenhuma venda registrada"
            description="As vendas registradas aparecerão aqui, com o histórico completo."
          />
        )}
      </div>
    </div>
  );
}
