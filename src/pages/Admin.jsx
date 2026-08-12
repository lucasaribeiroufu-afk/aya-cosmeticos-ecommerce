src/pages/Admin.jsx
import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Plus, Pencil, Trash2, X, Package, ShoppingCart } from 'lucide-react';
import Dashboard from '@/components/admin/Dashboard';

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      base44.entities.Product.list('-created_date', 100),
      base44.entities.Order.list('-created_date', 100),
    ])
      .then(([ps, os]) => {
        setProducts(ps);
        setOrders(os);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const del = async (id) => {
    if (!confirm('Excluir este produto?')) return;
    await base44.entities.Product.delete(id);
    load();
  };

  const updateStock = async (id, newStock) => {
    const stock = Math.max(0, Number(newStock) || 0);
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, stock } : p)));
    await base44.entities.Product.update(id, { stock });
  };

  const updateOrderStatus = async (id, status) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    await base44.entities.Order.update(id, { status });
  };

  const format = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const stats = {
    products: products.length,
    orders: orders.length,
    revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
    pending: orders.filter((o) => o.status === 'pending').length,
  };

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Painel Administrativo</p>
            <h1 className="font-display text-4xl md:text-5xl">Gestão Aya</h1>
          </div>
          {tab === 'products' && (
            <button onClick={() => setEditing({})} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-primary/90">
              <Plus className="w-4 h-4" strokeWidth={1.25} /> Novo Produto
            </button>
          )}
        </div>

        {tab !== 'dashboard' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard icon={Package} label="Produtos" value={stats.products} />
          <StatCard icon={ShoppingCart} label="Pedidos" value={stats.orders} />
          <StatCard icon={ShoppingCart} label="Pendentes" value={stats.pending} />
          <StatCard icon={Package} label="Receita" value={format(stats.revenue)} />
        </div>
        )}

        <div className="flex gap-1 mb-8 border-b micro-border">
          {['dashboard', 'products', 'orders'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-xs tracking-[0.15em] uppercase border-b-2 transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t === 'dashboard' ? 'Painel' : t === 'products' ? 'Produtos' : 'Pedidos'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => <div key={i} className="skeleton h-16 w-full" />)}
          </div>
        ) : tab === 'dashboard' ? (
          <Dashboard products={products} orders={orders} />
        ) : tab === 'products' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b micro-border">
                  <th className="py-4 font-normal">Produto</th>
                  <th className="py-4 font-normal">Categoria</th>
                  <th className="py-4 font-normal">Preço</th>
                  <th className="py-4 font-normal">Estoque</th>
                  <th className="py-4 font-normal text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/20">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-muted overflow-hidden shrink-0">
                          {p.image_url && <Image src={p.image_url} alt={p.name} fittingType="fill" className="w-full h-full" />}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{p.category || '—'}</td>
                    <td className="py-3">{format(p.price)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateStock(p.id, p.stock - 1)} className="w-7 h-7 flex items-center justify-center border micro-border hover:text-primary text-base leading-none">−</button>
                        <span className="w-10 text-center tabular-nums text-sm">{p.stock}</span>
                        <button onClick={() => updateStock(p.id, p.stock + 1)} className="w-7 h-7 flex items-center justify-center border micro-border hover:text-primary text-base leading-none">+</button>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(p)} aria-label="Editar" className="w-9 h-9 flex items-center justify-center border micro-border hover:text-primary">
                          <Pencil className="w-4 h-4" strokeWidth={1.25} />
                        </button>
                        <button onClick={() => del(p.id)} aria-label="Excluir" className="w-9 h-9 flex items-center justify-center border micro-border hover:text-destructive">
                          <Trash2 className="w-4 h-4" strokeWidth={1.25} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b micro-border">
                  <th className="py-4 font-normal">Pedido</th>
                  <th className="py-4 font-normal">Cliente</th>
                  <th className="py-4 font-normal">Total</th>
                  <th className="py-4 font-normal">Status</th>
                  <th className="py-4 font-normal">Pagamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-secondary/20">
                    <td className="py-3 font-mono text-xs">{o.order_number}</td>
                    <td className="py-3">{o.customer_name}</td>
                    <td className="py-3">{format(o.total)}</td>
                    <td className="py-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="text-xs border micro-border px-3 py-1.5 bg-transparent focus:border-primary outline-none cursor-pointer"
                      >
                        <option value="pending">Pendente</option>
                        <option value="paid">Pago</option>
                        <option value="processing">Processando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                    <td className="py-3 text-muted-foreground">{o.payment_method}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-muted-foreground">Nenhum pedido ainda.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && <ProductModal product={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </main>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="border micro-border p-6">
      <Icon className="w-5 h-5 text-primary mb-4" strokeWidth={1} />
      <p className="font-display text-3xl">{value}</p>
      <p className="text-xs text-muted-foreground tracking-wide mt-1">{label}</p>
    </div>
  );
}

function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product.name || '',
    slug: product.slug || '',
    subtitle: product.subtitle || '',
    description: product.description || '',
    category: product.category || '',
    price: product.price || 0,
    compare_at_price: product.compare_at_price || 0,
    stock: product.stock || 0,
    sku: product.sku || '',
    image_url: product.image_url || '',
    volume: product.volume || '',
    weight: product.weight || 0,
    width: product.width || 0,
    height: product.height || 0,
    length: product.length || 0,
    key_ingredients: (product.key_ingredients || []).join('\n'),
    benefits: (product.benefits || []).join('\n'),
    featured: product.featured || false,
    active: product.active !== false,
  });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      compare_at_price: Number(form.compare_at_price) || undefined,
      stock: Number(form.stock),
      weight: Number(form.weight) || undefined,
      width: Number(form.width) || undefined,
      height: Number(form.height) || undefined,
      length: Number(form.length) || undefined,
      key_ingredients: form.key_ingredients.split('\n').filter(Boolean),
      benefits: form.benefits.split('\n').filter(Boolean),
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
    };
    try {
      if (product.id) await base44.entities.Product.update(product.id, payload);
      else await base44.entities.Product.create(payload);
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[80] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display text-3xl">{product.id ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onClose} aria-label="Fechar" className="w-10 h-10 flex items-center justify-center"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <MField label="Nome" value={form.name} onChange={set('name')} required className="sm:col-span-2" />
          <MField label="Slug" value={form.slug} onChange={set('slug')} placeholder="auto se vazio" />
          <MField label="Categoria" value={form.category} onChange={set('category')} />
          <MField label="Subtítulo" value={form.subtitle} onChange={set('subtitle')} className="sm:col-span-2" />
          <MField label="Preço (R$)" type="number" step="0.01" value={form.price} onChange={set('price')} required />
          <MField label="Preço antigo (R$)" type="number" step="0.01" value={form.compare_at_price} onChange={set('compare_at_price')} />
          <MField label="Estoque" type="number" value={form.stock} onChange={set('stock')} />
          <MField label="Volume" value={form.volume} onChange={set('volume')} />
          <MField label="SKU" value={form.sku} onChange={set('sku')} />
          <MField label="Peso (kg)" type="number" step="0.01" value={form.weight} onChange={set('weight')} />
          <MField label="Largura (cm)" type="number" value={form.width} onChange={set('width')} />
          <MField label="Altura (cm)" type="number" value={form.height} onChange={set('height')} />
          <MField label="Comprimento (cm)" type="number" value={form.length} onChange={set('length')} />
          <MField label="URL da imagem" value={form.image_url} onChange={set('image_url')} className="sm:col-span-2" />
          <label className="sm:col-span-2">
            <span className="text-xs text-muted-foreground block mb-2">Descrição</span>
            <textarea value={form.description} onChange={set('description')} rows={3} className="w-full bg-transparent border micro-border px-4 py-3 text-sm focus:border-primary outline-none" />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs text-muted-foreground block mb-2">Ativos (um por linha — Nome: benefício)</span>
            <textarea value={form.key_ingredients} onChange={set('key_ingredients')} rows={3} className="w-full bg-transparent border micro-border px-4 py-3 text-sm focus:border-primary outline-none" />
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs text-muted-foreground block mb-2">Benefícios (um por linha)</span>
            <textarea value={form.benefits} onChange={set('benefits')} rows={3} className="w-full bg-transparent border micro-border px-4 py-3 text-sm focus:border-primary outline-none" />
          </label>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-primary" />
            <span className="text-sm">Destaque na home</span>
          </label>
          <div className="sm:col-span-2 flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground py-3 text-xs tracking-[0.15em] uppercase disabled:opacity-50">
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
            <button type="button" onClick={onClose} className="px-6 border micro-border text-xs tracking-[0.15em] uppercase">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MField({ label, className, ...props }) {
  return (
    <label className={`block ${className || ''}`}>
      <span className="text-xs text-muted-foreground block mb-2">{label}</span>
      <input {...props} className="w-full bg-transparent border micro-border px-4 py-3 text-sm focus:border-primary outline-none transition-colors" />
    </label>
  );
}
