import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import Dashboard from '@/components/admin/Dashboard';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula o carregamento dos dados de produtos e pedidos de forma limpa
    // Aqui você poderá plugar o Supabase ou outra API futuramente
    const loadAdminData = async () => {
      try {
        // Dados de exemplo para o painel não nascer vazio e manter o layout intacto
        setProducts([
          { id: 1, name: 'Sérum Facial Rejuvenescedor', price: 129.90, created_date: new Date() },
          { id: 2, name: 'Hidratante Corporal Nutritivo', price: 89.90, created_date: new Date() }
        ]);
        setOrders([
          { id: 101, total: 219.80, status: 'completed', created_date: new Date() }
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados do painel:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const format = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const stats = {
    products: products.length,
    orders: orders.length,
    revenue: orders.reduce((s, o) => s + (o.total || 0), 0),
    pending: orders.filter((o) => o.status === 'pending').length,
  };

  if (loading) {
    return <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-16 w-full" />)}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard icon={Package} label="Produtos" value={stats.products} />
        <StatCard icon={ShoppingCart} label="Pedidos" value={stats.orders} />
        <StatCard icon={Clock} label="Pendentes" value={stats.pending} />
        <StatCard icon={DollarSign} label="Receita" value={format(stats.revenue)} />
      </div>
      <Dashboard products={products} orders={orders} />
    </div>
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
