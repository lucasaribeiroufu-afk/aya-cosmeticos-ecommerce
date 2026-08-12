import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    base44.entities.Order.list('-created_date', 100)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const updateOrderStatus = async (id, status) => {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    await base44.entities.Order.update(id, { status });
  };

  const format = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loading) {
    return <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-16 w-full" />)}</div>;
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-8">Gerenciar Pedidos</h2>
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
    </div>
  );
}
