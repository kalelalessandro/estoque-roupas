import { FormEvent, useCallback, useEffect, useState } from 'react';
import { productsApi } from '../api/products';
import { stockApi } from '../api/stock';
import { useRealtime } from '../hooks/useRealtime';
import { Product, StockEntry } from '../types';

export function Stock() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    stockApi.list().then(setEntries);
    productsApi.list().then(setProducts);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(load);

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
      const entry = await stockApi.create(productId, Number(quantity));
      setSuccess(`Entrada registrada: +${quantity} un. de ${entry.product.name}`);
      setProductId('');
      setQuantity(1);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Não foi possível registrar a entrada');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink">Estoque</h1>
        <p className="text-sm text-ink/50">Entrada de mercadorias e histórico</p>
      </div>

      <div className="card p-6">
        <h2 className="mb-4 text-sm font-medium text-ink">Adicionar ao estoque</h2>
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
                <option key={p.id} value={p.id}>
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
              className="input"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary h-fit">
            {saving ? 'Registrando...' : 'Adicionar'}
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
              <th className="th">Qtd. adicionada</th>
              <th className="th">Data</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 && (
              <tr>
                <td className="td text-ink/50" colSpan={4}>
                  Nenhuma entrada registrada ainda.
                </td>
              </tr>
            )}
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="td font-medium">{entry.product.name}</td>
                <td className="td font-mono text-xs text-ink/60">{entry.product.sku}</td>
                <td className="td font-mono text-accent">+{entry.quantity}</td>
                <td className="td text-ink/60">
                  {new Date(entry.createdAt).toLocaleString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
