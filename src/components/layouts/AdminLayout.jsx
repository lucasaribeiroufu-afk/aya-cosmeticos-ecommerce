import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Painel', end: true },
    { to: '/admin/produtos', icon: Package, label: 'Produtos' },
    { to: '/admin/pedidos', icon: ShoppingCart, label: 'Pedidos' },
  ];

  return (
    <main className="pt-24 pb-32 min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Cabeçalho do Admin */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">Painel Administrativo</p>
            <h1 className="font-display text-4xl md:text-5xl">Gestão Aya</h1>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="self-start md:self-auto border micro-border px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-secondary/20 transition-colors"
          >
            Ver Loja
          </button>
        </div>

        {/* Menu de Navegação por Rotas Filhas */}
        <div className="flex gap-1 mb-8 border-b micro-border">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-6 py-3 text-xs tracking-[0.15em] uppercase border-b-2 transition-colors ${
                    isActive
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <Icon className="w-4 h-4" strokeWidth={1.25} />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        {/* Onde as sub-páginas serão injetadas */}
        <Outlet />
      </div>
    </main>
  );
}
