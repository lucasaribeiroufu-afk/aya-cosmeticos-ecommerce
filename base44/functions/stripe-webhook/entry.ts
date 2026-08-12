import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const Stripe = (await import('npm:stripe@17.3.0')).default;
    const stripe = Stripe(secrets.get('STRIPE_SECRET_KEY'));

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return Response.json({ error: 'Assinatura ausente' }, { status: 400 });
    }

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      secrets.get('STRIPE_WEBHOOK_SECRET')
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      if (orderId) {
        await base44.asServiceRole.entities.Order.update(orderId, {
          status: 'paid',
          payment_method: 'stripe',
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
}
