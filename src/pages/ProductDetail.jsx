import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ChevronDown, Check, ArrowLeft } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useCart } from '@/lib/cart-context';
import { api } from '@/lib/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const { add, openCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [openIngredient, setOpenIngredient] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const data = await api.products.get(slug);
        setProduct(data);
      } catch (err) {
        console.error('Erro ao carregar detalhes do produto', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [slug]);

  const format = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return (
      <main className="pt-32 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="skeleton aspect-[3/4] w-full" />
          <div className="space-y-4 pt-10">
            <div className="skeleton h-4 w-1/4" />
            <div className="skeleton h-10 w-3/4" />
            <div className="skeleton h-6 w-1/3" />
            <div className="skeleton h-24 w-full mt-6" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-40 min-h-screen text-center">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Link to="/colecao" className="inline-flex items-center gap-2 mt-6 text-primary border-b border-primary pb-1">
          <ArrowLeft className="w-4 h-4" /> Voltar à coleção
        </Link>
      </main>
    );
  }

  const handleAdd = () => {
    add(product, qty);
    openCart();
  };

  return (
    <main className="pt-28 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <Link to="/colecao" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.25} /> Coleção
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="space-y-4">
            <div className="relative bg-muted aspect-[3/4] overflow-hidden">
              <Image src={product.image_url} alt={product.name} fittingType="fill" className="w-full h-full" />
            </div>
            <div className="flex gap-3">
              {(product.gallery || []).slice(0, 3).map((g, i) => (
                <div key={i} className="w-20 h-24 bg-muted overflow-hidden">
                  <Image src={g} alt={`${product.name} ${i + 1}`} fittingType="fill" className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-primary mb-5">
              <Check className="w-4 h-4" strokeWidth={1.5} /> Factory to Face · CNAE 2063-1/00
            </div>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">{product.category}</p>
            <h1 className="font-display text-4xl md:text-5xl leading-tight mb-3">{product.name}</h1>
            {product.subtitle && <p className="text-lg text-muted-foreground mb-4">{product.subtitle}</p>}

            <div className="flex items-center gap-4 mb-8">
              <span className="font-display text-3xl">{format(product.price)}</span>
              {product.compare_at_price && (
                <span className="text-muted-foreground line-through">{format(product.compare_at_price)}</span>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>
            )}

            {product.benefits && product.benefits.length > 0 && (
              <ul className="space-y-2 mb-8">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border micro-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir" className="w-12 h-12 flex items-center justify-center hover:text-primary">
                  <Minus className="w-4 h-4" strokeWidth={1.25} />
                </button>
                <span className="w-12 text-center">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Aumentar" className="w-12 h-12 flex items-center justify-center hover:text-primary">
                  <Plus className="w-4 h-4" strokeWidth={1.25} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className="flex-1 bg-primary text-primary-foreground py-4 text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                {product.stock > 0 ? 'Adicionar à Sacola' : 'Esgotado'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-10">{product.stock} em estoque · {product.volume || 'Volume padrão'}</p>

            {product.key_ingredients && product.key_ingredients.length > 0 && (
              <div className="border-t micro-border pt-8">
                <h3 className="font-display text-2xl mb-4">Mergulho nos Ativos</h3>
                <div className="divide-y divide-border">
                  {product.key_ingredients.map((ing, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setOpenIngredient(openIngredient === i ? null : i)}
                        className="w-full flex justify-between items-center py-4 text-left"
                      >
                        <span className="text-sm">{ing.split(':')[0]}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openIngredient === i ? 'rotate-180' : ''}`} strokeWidth={1.25} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openIngredient === i ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {ing.split(':')[1]?.trim() || 'Ativo botânico selecionado para potencializar a eficácia da fórmula.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
