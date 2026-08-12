import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { order_id, order_number, items, shipping_cost, customer_email, success_url, cancel_url } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Items são obrigatórios' }, { status: 400 });
    }

    const token = secrets.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (!token) {
      return Response.json({ error: 'Access Token do Mercado Pago não configurado' }, { status: 500 });
    }

    const preferenceItems = items.map((item, i) => ({
      id: String(i + 1),
      title: item.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.price),
      currency_id: 'BRL',
    }));

    if (shipping_cost && Number(shipping_cost) > 0) {
      preferenceItems.push({
        id: 'shipping',
        title: 'Frete',
        quantity: 1,
        unit_price: Number(shipping_cost),
        currency_id: 'BRL',
      });
    }

    const payload = {
      items: preferenceItems,
      payer: customer_email ? { email: customer_email } : undefined,
      back_urls: {
        success: success_url,
        failure: cancel_url,
        pending: success_url,
      },
      auto_return: 'approved',
      external_reference: order_number,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        order_id,
      },
      statement_descriptor: 'AYA COSMETICOS',
    };

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Mercado Pago API error:', res.status, errText);
      return Response.json({ error: `Erro Mercado Pago (${res.status})` }, { status: 502 });
    }

    const data = await res.json();
    return Response.json({ url: data.init_point });
  } catch (error) {
    console.error('Mercado Pago preference error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
