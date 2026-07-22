import { FormEvent, useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/products';
import { salesApi } from '../api/sales';
import { useRealtime } from '../hooks/useRealtime';
import { Product, Sale } from '../types';

export function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    salesApi.list().then(setSales);
    productsApi.list().then(setProducts);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(load);

  const selectedProduct = products.find((p) => p.id === productId);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!productId) {
      setError('Selecione um produto');
      return;
    }

    setSaving(true);
    try {
      const sale = await salesApi.create(productId, Number(quantity));
      setSuccess(
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
      <div>
        <h1 className="text-lg font-semibold text-ink">Vendas</h1>
        <p className="text-sm text-ink/50">Registro manual de vendas e histórico</p>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-sm font-medium text-ink">Registrar venda</h2>
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

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        {success && <p className="mt-3 text-sm text-accent">{success}</p>}
      </div>

      <div className="card overflow-hidden">
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
            {sales.length === 0 && (
              <tr>
                <td className="td text-ink/50" colSpan={5}>
                  Nenhuma venda registrada ainda.
                </td>
              </tr>
            )}
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td className="td font-medium">{sale.product.name}</td>
                <td className="td font-mono text-xs text-ink/60">{sale.product.sku}</td>
                <td className="td font-mono">{sale.quantity}</td>
                <td className="td font-mono">
                  {sale.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className="td text-ink/60">
                  {new Date(sale.createdAt).toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
