import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

const DEFAULT_WEIGHT = 0.3;
const DEFAULT_WIDTH = 16;
const DEFAULT_HEIGHT = 11;
const DEFAULT_LENGTH = 17;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { to_postal_code, items } = body;

    if (!to_postal_code || !items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'CEP e produtos são obrigatórios' }, { status: 400 });
    }

    const fromPostalCode = (secrets.get('MELHOR_ENVIO_POSTAL_CODE') || '38400000').replace(/\D/g, '');
    const token = secrets.get('MELHOR_ENVIO_TOKEN');
    const destCep = to_postal_code.replace(/\D/g, '');

    if (!token) {
      return Response.json({ error: 'Token Melhor Envio não configurado' }, { status: 500 });
    }

    const productIds = items.map((i) => i.product_id);
    const allProducts = await base44.asServiceRole.entities.Product.filter({ active: true });
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    const products = items.map((item, i) => {
      const p = productMap.get(item.product_id) || {};
      const qty = item.quantity || 1;
      return {
        id: String(i + 1),
        width: p.width || DEFAULT_WIDTH,
        height: p.height || DEFAULT_HEIGHT,
        length: p.length || DEFAULT_LENGTH,
        weight: (p.weight || DEFAULT_WEIGHT) * qty,
        insurance_value: (p.price || 0) * qty,
        quantity: 1,
      };
    });

    const payload = {
      from: { postal_code: fromPostalCode },
      to: { postal_code: destCep },
      products,
      options: { receipt: false, own_hand: false },
    };

    const res = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Melhor Envio API error:', res.status, errText);
      return Response.json({ error: `Erro Melhor Envio (${res.status})` }, { status: 502 });
    }

    const data = await res.json();
    const rawOptions = Array.isArray(data) ? data : (data.data || []);

    const options = rawOptions
      .filter((opt) => opt && opt.price > 0)
      .map((opt, i) => ({
        carrier_id: opt.id || i,
        carrier: opt.company?.name || opt.name || 'Transportadora',
        service: opt.type || opt.name || 'Entrega',
        price: Number(opt.price),
        delivery_days: opt.delivery_time || opt.delivery_max || opt.delivery_min || 0,
      }));

    return Response.json({ options });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
