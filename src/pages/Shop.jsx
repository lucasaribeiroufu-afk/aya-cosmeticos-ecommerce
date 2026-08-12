import React, { useEffect, useState, useMemo } from 'react';
import ProductCard from '@/components/store/ProductCard';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Substitua estas chamadas simuladas pelos seus endpoints reais de API
    const fetchCatalogData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?active=true&sort=-created_date&limit=60'),
          fetch('/api/categories?sort=-sort_order&limit=50')
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Falha na resposta da API');
        }

        const ps = await productsRes.json();
        const cats = await categoriesRes.json();

        setProducts(Array.isArray(ps) ? ps : []);
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        // Para fins de desenvolvimento ou transição sem backend pronto, insira mock se necessário
        setError('Não foi possível carregar o catálogo no momento.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogData();
  }, []);

  const filtered = useMemo(
    () => (active === 'Todos' ? products : products.filter((p) => p.category === active)),
    [products, active]
  );

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">A Coleção</p>
          <h1 className="font-display text-5xl md:text-6xl">Catálogo Completo</h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Fórmulas pensadas para cada gesto do seu ritual diário.
          </p>
        </div>

        {error ? (
          <div className="text-center py-20 text-destructive text-sm tracking-wide">
            {error}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              {['Todos', ...categories.map((c) => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-5 py-2.5 text-xs tracking-[0.1em] uppercase transition-all ${
                    active === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'border micro-border text-muted-foreground hover:border-primary hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="space-y-4">
                    <div className="skeleton aspect-[3/4] w-full" />
                    <div className="skeleton h-4 w-1/3" />
                    <div className="skeleton h-6 w-2/3" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-20">Nenhum produto nesta categoria.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
