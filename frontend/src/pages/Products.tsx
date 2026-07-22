import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ProductInput, productsApi } from '../api/products';
import { useRealtime } from '../hooks/useRealtime';
import { Product } from '../types';

const emptyForm: ProductInput = {
  name: '',
  category: '',
  size: '',
  color: '',
  price: 0,
  quantity: 0,
};

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback((term?: string) => {
    productsApi
      .list(term)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(() => load(search));

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    load(search);
  }

  function openCreateModal() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      category: product.category,
      size: product.size,
      color: product.color,
      price: product.price,
      quantity: product.quantity,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await productsApi.update(editing.id, {
          name: form.name,
          category: form.category,
          size: form.size,
          color: form.color,
          price: Number(form.price),
        });
      } else {
        await productsApi.create({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        });
      }
      setModalOpen(false);
      load(search);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Não foi possível salvar o produto');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Excluir "${product.name}"? Esta ação não pode ser desfeita.`)) return;
    await productsApi.remove(product.id);
    load(search);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink">Produtos</h1>
          <p className="text-sm text-ink/50">Cadastro e controle do catálogo</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          + Adicionar
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          className="input max-w-xs"
          placeholder="Buscar por nome ou SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-secondary">
          Buscar
        </button>
      </form>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="th">Produto</th>
              <th className="th">SKU</th>
              <th className="th">Categoria</th>
              <th className="th">Tam. / Cor</th>
              <th className="th">Preço</th>
              <th className="th">Qtd.</th>
              <th className="th"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="td text-ink/50" colSpan={7}>
                  Carregando...
                </td>
              </tr>
            )}
            {!loading && products.length === 0 && (
              <tr>
                <td className="td text-ink/50" colSpan={7}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id}>
                <td className="td font-medium">{product.name}</td>
                <td className="td font-mono text-xs text-ink/60">{product.sku}</td>
                <td className="td">{product.category}</td>
                <td className="td">
                  {product.size} / {product.color}
                </td>
                <td className="td font-mono">
                  {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td className={`td font-mono ${product.quantity <= 5 ? 'text-danger' : ''}`}>
                  {product.quantity}
                </td>
                <td className="td">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEditModal(product)} className="btn-secondary px-3 py-1 text-xs">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(product)} className="btn-danger">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 px-4">
          <div className="card w-full max-w-md p-6">
            <h2 className="mb-4 text-sm font-semibold text-ink">
              {editing ? 'Editar produto' : 'Novo produto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Nome</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Categoria</label>
                  <input
                    className="input"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Tamanho</label>
                  <input
                    className="input"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Cor</label>
                  <input
                    className="input"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              {!editing && (
                <div>
                  <label className="label">Quantidade inicial</label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    required
                  />
                </div>
              )}

              {formError && <p className="text-sm text-danger">{formError}</p>}

              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
