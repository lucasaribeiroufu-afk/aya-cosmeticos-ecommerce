import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.Product.list('-created_date', 100)
      .then(setProducts)
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

  const format = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display text-2xl">Gerenciar Produtos</h2>
        <button onClick={() => setEditing({})} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-primary/90">
          <Plus className="w-4 h-4" strokeWidth={1.25} /> Novo Produto
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-16 w-full" />)}</div>
      ) : (
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
                      <button onClick={() => updateStock(p.id, p.stock - 1)} className="w-7 h-7 flex items-center justify-center border micro-border hover:text-primary">−</button>
                      <span className="w-10 text-center tabular-nums text-sm">{p.stock}</span>
                      <button onClick={() => updateStock(p.id, p.stock + 1)} className="w-7 h-7 flex items-center justify-center border micro-border hover:text-primary">+</button>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(p)} className="w-9 h-9 flex items-center justify-center border micro-border hover:text-primary"><Pencil className="w-4 h-4" strokeWidth={1.25} /></button>
                      <button onClick={() => del(p.id)} className="w-9 h-9 flex items-center justify-center border micro-border hover:text-destructive"><Trash2 className="w-4 h-4" strokeWidth={1.25} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <ProductModal product={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
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
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
          <MField label="Nome" value={form.name} onChange={set('name')} required className="sm:col-span-2" />
          <MField label="Slug" value={form.slug} onChange={set('slug')} placeholder="auto se vazio" />
          <MField label="Categoria" value={form.category} onChange={set('category')} />
          <MField label="Preço (R$)" type="number" step="0.01" value={form.price} onChange={set('price')} required />
          <MField label="Estoque" type="number" value={form.stock} onChange={set('stock')} />
          <MField label="URL da imagem" value={form.image_url} onChange={set('image_url')} className="sm:col-span-2" />
          <div className="sm:col-span-2 flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground py-3 text-xs tracking-[0.15em] uppercase disabled:opacity-50">{saving ? 'Salvando…' : 'Salvar'}</button>
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
      <input {...props} className="w-full bg-transparent border micro-border px-4 py-3 text-sm focus:border-primary outline-none" />
    </label>
  );
}
