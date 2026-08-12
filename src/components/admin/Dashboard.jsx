import React from 'react';
import { Image } from '@/components/ui/image';
import { TrendingUp, ShoppingBag, Receipt, AlertTriangle } from 'lucide-react';

export default function Dashboard({ products, orders }) {
  const format = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.created_date).toDateString() === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
  const avgTicket = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

  const outOfStock = products.filter((p) => (p.stock || 0) === 0);
  const lowStock = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5);
  const stockAlerts = [...outOfStock, ...lowStock].slice(0, 8);

  const recentOrders = orders.slice(0, 6);

  const statusLabels = { pending: 'Pendente', paid: 'Pago', processing: 'Processando', shipped: 'Enviado', delivered: 'Entregue', cancelled: 'Cancelado' };
  const statusColors = {
    pending: 'bg-secondary text-secondary-foreground',
    paid: 'bg-primary/15 text-primary',
    processing: 'bg-secondary text-secondary-foreground',
    shipped: 'bg-primary/15 text-primary',
    delivered: 'bg-primary text-primary-foreground',
    cancelled: 'bg-destructive/15 text-destructive',
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard icon={TrendingUp} label="Vendas do Dia" value={format(todayRevenue)} />
        <KpiCard icon={ShoppingBag} label="Pedidos Hoje" value={todayOrders.length} />
        <KpiCard icon={Receipt} label="Ticket Médio" value={format(avgTicket)} />
        <KpiCard icon={AlertTriangle} label="Alertas de Estoque" value={outOfStock.length + lowStock.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-display text-2xl mb-5">Pedidos Recentes</h2>
          <div className="border micro-border divide-y divide-border">
            {recentOrders.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">Nenhum pedido ainda.</p>
            ) : (
              recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-4 hover:bg-secondary/20">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-muted-foreground">{o.order_number}</p>
                    <p className="text-sm font-medium truncate">{o.customer_name}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-xs px-3 py-1 ${statusColors[o.status] || statusColors.pending}`}>{statusLabels[o.status] || o.status}</span>
                    <span className="text-sm font-medium">{format(o.total)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl mb-5">Resumo de Estoque</h2>
          <div className="border micro-border divide-y divide-border">
            {stockAlerts.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground text-center">Estoque saudável — sem alertas.</p>
            ) : (
              stockAlerts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-4 hover:bg-secondary/20">
                  <div className="w-8 h-10 bg-muted overflow-hidden shrink-0">
                    {p.image_url && <Image src={p.image_url} alt={p.name} fittingType="fill" className="w-full h-full" />}
                  </div>
                  <span className="text-sm font-medium flex-1 truncate">{p.name}</span>
                  <span className={`text-xs px-3 py-1 ${(p.stock || 0) === 0 ? 'bg-destructive/15 text-destructive' : 'bg-secondary text-secondary-foreground'}`}>
                    {(p.stock || 0) === 0 ? 'Sem estoque' : `${p.stock} un.`}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value }) {
  return (
    <div className="border micro-border p-6">
      <Icon className="w-5 h-5 text-primary mb-4" strokeWidth={1} />
      <p className="font-display text-2xl md:text-3xl">{value}</p>
      <p className="text-xs text-muted-foreground tracking-wide mt-1">{label}</p>
    </div>
  );
}
