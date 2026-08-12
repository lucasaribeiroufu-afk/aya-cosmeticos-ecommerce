import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Image } from '@/components/ui/image';

export default function CartDrawer() {
  const { items, isOpen, closeCart, remove, setQty, subtotal, count } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const format = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
      <div
        className={`fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background z-[70] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-8 py-6 border-b micro-border">
          <div>
            <h3 className="font-display text-2xl">Sua Sacola</h3>
            <p className="text-xs text-muted-foreground tracking-wide">{count} {count === 1 ? 'item' : 'itens'}</p>
          </div>
          <button onClick={closeCart} aria-label="Fechar" className="w-11 h-11 flex items-center justify-center hover:text-primary transition-colors">
            <X className="w-5 h-5" strokeWidth={1.25} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/40" strokeWidth={0.75} />
            <p className="text-muted-foreground">Sua sacola está vazia.<br />Descubra a coleção e inicie seu ritual.</p>
            <Link to="/colecao" onClick={closeCart} className="text-sm tracking-wide border-b border-primary text-primary pb-1">
              Explorar coleção
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 hide-scrollbar">
              {items.map((item) => (
                <div key={item.product_id} className="flex gap-4">
                  <div className="w-20 h-24 bg-muted shrink-0 overflow-hidden">
                    {item.image_url && <Image src={item.image_url} alt={item.name} fittingType="fill" className="w-full h-full" />}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-2">
                      <h4 className="font-display text-lg leading-tight">{item.name}</h4>
                      <button onClick={() => remove(item.product_id)} aria-label="Remover" className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-4 h-4" strokeWidth={1.25} />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{format(item.price)}</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <button onClick={() => setQty(item.product_id, item.quantity - 1)} aria-label="Diminuir" className="w-8 h-8 flex items-center justify-center border micro-border">
                        <Minus className="w-3 h-3" strokeWidth={1.5} />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => setQty(item.product_id, item.quantity + 1)} aria-label="Aumentar" className="w-8 h-8 flex items-center justify-center border micro-border">
                        <Plus className="w-3 h-3" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t micro-border px-8 py-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-xl">{format(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Frete e impostos calculados no checkout.</p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block w-full text-center bg-primary text-primary-foreground py-4 tracking-[0.15em] uppercase text-xs hover:bg-primary/90 transition-colors"
              >
                Finalizar Compra
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
