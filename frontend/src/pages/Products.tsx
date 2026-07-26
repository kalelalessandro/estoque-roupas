import { Pencil, Plus, RotateCcw, Search, Tags, Trash2, X } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { ProductInput, productsApi } from '../api/products';
import { useConfirm } from '../components/ui/ConfirmProvider';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { SkeletonRows } from '../components/ui/SkeletonRows';
import { useToast } from '../components/ui/ToastProvider';
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
  const [showInactive, setShowInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const toast = useToast();
  const confirm = useConfirm();

  const load = useCallback((term?: string, includeInactive?: boolean) => {
    productsApi
      .list(term, includeInactive)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    load(search, showInactive);
  }, [load, showInactive]); // eslint-disable-line react-hooks/exhaustive-deps

  useRealtime(() => load(search, showInactive));

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    load(search, showInactive);
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
        toast(`"${form.name}" atualizado com sucesso.`);
      } else {
        await productsApi.create({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
        });
        toast(`"${form.name}" adicionado ao catálogo.`);
      }
      setModalOpen(false);
      load(search, showInactive);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || 'Não foi possível salvar o produto');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    const ok = await confirm({
      title: `Excluir "${product.name}"?`,
      description:
        'Se o produto não tiver vendas ou entradas de estoque, ele será excluído para sempre. Se já tiver histórico, será apenas desativado (some das listas, mas o histórico continua salvo).',
      confirmLabel: 'Excluir',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      const result = await productsApi.remove(product.id);
      if (result.deactivated) {
        toast(`"${product.name}" tem histórico e foi desativado (não excluído).`, 'info');
      } else {
        toast(`"${product.name}" removido do catálogo.`, 'info');
      }
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Já não existe mais (removido em outra sessão/aba) — apenas atualiza a lista.
        toast(`"${product.name}" já não estava mais no catálogo.`, 'info');
      } else {
        console.error('Falha ao excluir produto', err);
        toast(err?.response?.data?.message || 'Não foi possível excluir o produto. Tente novamente.', 'error');
      }
    } finally {
      load(search, showInactive);
    }
  }

  async function handleReactivate(product: Product) {
    try {
      await productsApi.reactivate(product.id);
      toast(`"${product.name}" reativado.`);
      load(search, showInactive);
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Não foi possível reativar o produto.', 'error');
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Produtos"
        description="Cadastro e controle do catálogo"
        actions={
          <button onClick={openCreateModal} className="btn-primary">
            <Plus size={16} />
            Adicionar
          </button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative max-w-xs flex-1">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              className="input pl-9"
              placeholder="Buscar por nome ou SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-secondary">
            Buscar
          </button>
        </form>

        <label className="flex select-none items-center gap-2 text-sm text-ink/60">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="h-4 w-4 rounded border-line text-accent focus:ring-accent/30"
          />
          Mostrar desativados
        </label>
      </div>

      <div className="card overflow-hidden">
        {/* Desktop / tablet: table view */}
        <div className="hidden overflow-x-auto md:block">
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
              {loading && <SkeletonRows columns={7} />}
              {!loading &&
                products.map((product, i) => (
                  <tr
                    key={product.id}
                    className={`table-row animate-fade-in ${!product.active ? 'opacity-50' : ''}`}
                    style={{ animationDelay: `${i * 25}ms` }}
                  >
                    <td className="td font-medium">
                      <div className="flex items-center gap-2">
                        {product.name}
                        {!product.active && (
                          <span className="rounded-full bg-sunken px-2 py-0.5 text-2xs font-medium uppercase tracking-wide text-ink/45">
                            Desativado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="td">
                      <span className="tag-badge">{product.sku}</span>
                    </td>
                    <td className="td text-ink/70">{product.category}</td>
                    <td className="td text-ink/70">
                      {product.size} / {product.color}
                    </td>
                    <td className="td font-mono">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="td">
                      <span
                        className={`font-mono ${
                          product.quantity <= 5 ? 'font-semibold text-danger' : 'text-ink'
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </td>
                    <td className="td">
                      <div className="flex justify-end gap-1.5">
                        {product.active ? (
                          <>
                            <button
                              onClick={() => openEditModal(product)}
                              className="icon-btn"
                              aria-label={`Editar ${product.name}`}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="icon-btn hover:!bg-danger-soft hover:!text-danger"
                              aria-label={`Excluir ${product.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleReactivate(product)}
                            className="icon-btn hover:!bg-accent-soft hover:!text-accent-dark"
                            aria-label={`Reativar ${product.name}`}
                          >
                            <RotateCcw size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: card list so actions are always visible without side-scrolling */}
        <div className="divide-y divide-line-soft/80 md:hidden">
          {loading && (
            <div className="space-y-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2.5 p-4">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              ))}
            </div>
          )}
          {!loading &&
            products.map((product, i) => (
              <div
                key={product.id}
                className={`animate-fade-in p-4 transition-colors duration-150 active:bg-sunken/60 ${!product.active ? 'opacity-50' : ''}`}
                style={{ animationDelay: `${i * 25}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate font-medium text-ink">{product.name}</p>
                      {!product.active && (
                        <span className="rounded-full bg-sunken px-2 py-0.5 text-2xs font-medium uppercase tracking-wide text-ink/45">
                          Desativado
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span className="tag-badge">{product.sku}</span>
                      <span className="text-xs text-ink/50">
                        {product.category} · {product.size} / {product.color}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-sm font-medium text-ink">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p
                      className={`font-mono text-xs ${
                        product.quantity <= 5 ? 'font-semibold text-danger' : 'text-ink/50'
                      }`}
                    >
                      {product.quantity} un.
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  {product.active ? (
                    <>
                      <button onClick={() => openEditModal(product)} className="btn-secondary h-9 flex-1 !text-xs">
                        <Pencil size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="btn-secondary h-9 flex-1 !border-danger/25 !text-xs !text-danger hover:!bg-danger-soft"
                      >
                        <Trash2 size={14} />
                        Excluir
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReactivate(product)}
                      className="btn-secondary h-9 flex-1 !border-accent/25 !text-xs !text-accent-dark hover:!bg-accent-soft"
                    >
                      <RotateCcw size={14} />
                      Reativar
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {!loading && products.length === 0 && (
          <EmptyState
            icon={Tags}
            title={search ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            description={
              search
                ? 'Tente buscar por outro nome ou SKU.'
                : 'Comece adicionando o primeiro produto ao seu catálogo.'
            }
            action={
              !search && (
                <button onClick={openCreateModal} className="btn-primary">
                  <Plus size={16} />
                  Adicionar produto
                </button>
              )
            }
          />
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-[2px] animate-fade-in sm:items-center sm:px-4"
          onClick={() => setModalOpen(false)}
          role="presentation"
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto animate-slide-up-sheet rounded-t-2xl border border-line-soft bg-surface p-6 shadow-lift sm:animate-scale-in sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                {editing ? 'Editar produto' : 'Novo produto'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="icon-btn" aria-label="Fechar">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="label">Nome</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
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

              {formError && (
                <p className="animate-fade-in rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">
                  {formError}
                </p>
              )}

              <div className="mt-2 flex justify-end gap-2 pt-1">
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
