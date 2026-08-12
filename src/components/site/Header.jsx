import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const NAV = [
  { label: 'Coleção', path: '/colecao' },
  { label: 'A Ciência', path: '/#ciencia' },
  { label: 'Ritual', path: '/#ritual' },
  { label: 'Admin', path: '/admin' },
];

export default function Header() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass micro-border border-b py-4' : 'bg-transparent py-6'
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl tracking-tight text-foreground">Aya</span>
          <span className="text-[0.625rem] tracking-[0.3em] uppercase text-muted-foreground">Cosméticos</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-sm tracking-wide text-foreground/80 hover:text-primary transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            aria-label="Abrir carrinho"
            className="relative w-12 h-12 flex items-center justify-center hover:text-primary transition-colors"
          >
            <ShoppingBag className="w-5 h-5" strokeWidth={1.25} />
            {count > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[0.625rem] font-medium flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden w-12 h-12 flex items-center justify-center"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden glass border-t micro-border mt-4">
          <div className="px-6 py-6 flex flex-col gap-5">
            {NAV.map((item) => (
              <Link key={item.label} to={item.path} className="text-base text-foreground/80">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
