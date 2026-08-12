import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Image } from '@/components/ui/image';

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [hovered, setHovered] = useState(false);
  const format = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <article
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/produto/${product.slug}`} className="block relative overflow-hidden bg-muted aspect-[3/4] mb-5">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fittingType="fill"
            className="w-full h-full transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            add(product);
          }}
          aria-label="Adicionar à sacola"
          className={`absolute bottom-4 right-4 w-12 h-12 glass micro-border rounded-full flex items-center justify-center transition-all duration-300 ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          } hover:bg-primary hover:text-primary-foreground`}
        >
          <Plus className="w-5 h-5" strokeWidth={1.25} />
        </button>
        {product.compare_at_price && (
          <span className="absolute top-4 left-4 text-[0.625rem] tracking-[0.2em] uppercase bg-secondary text-secondary-foreground px-3 py-1">
            Oferta
          </span>
        )}
      </Link>
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">{product.category}</p>
        <Link to={`/produto/${product.slug}`}>
          <h3 className="font-display text-xl leading-snug hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        {product.subtitle && <p className="text-sm text-muted-foreground mt-1">{product.subtitle}</p>}
        <div className="flex items-center gap-3 mt-2">
          <span className="text-base">{format(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-sm text-muted-foreground line-through">{format(product.compare_at_price)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
