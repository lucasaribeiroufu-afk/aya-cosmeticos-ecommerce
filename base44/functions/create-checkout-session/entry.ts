import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { order_id, order_number, items, shipping_cost, customer_email, success_url, cancel_url } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    const Stripe = (await import('npm:stripe@17.3.0')).default;
    const stripe = Stripe(secrets.get('STRIPE_SECRET_KEY'));

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'brl',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shipping_cost && shipping_cost > 0) {
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: { name: 'Frete' },
          unit_amount: Math.round(shipping_cost * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customer_email || undefined,
      success_url,
      cancel_url,
      metadata: {
        order_id,
        order_number,
        base44_app_id: secrets.get('BASE44_APP_ID'),
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
