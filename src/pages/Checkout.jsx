import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Lock, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { calculateShipping } from '@/utils/shipping';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState(null);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  
  // Estados ajustados para o cálculo de frete local com o utilitário
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    document_cpf: '', shipping_zipcode: '', shipping_address: '',
    shipping_city: '', shipping_state: '',
  });

  const shippingCost = selectedShipping?.price || 0;
  const total = subtotal + shippingCost;
  const format = (n) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCalculateShipping = () => {
    const cep = form.shipping_zipcode.replace(/\D/g, '');
    setShippingError(null);
    setShippingOptions([]);
    setSelectedShipping(null);

    if (cep.length !== 8) {
      setShippingError('Digite um CEP válido (8 dígitos)');
      return;
    }

    setCalculatingShipping(true);
    try {
      // Utilizando a função local em src/utils/shipping.js
      const result = calculateShipping(cep, subtotal);
      
      const option = {
        carrier_id: 'standard',
        carrier: 'Correios / Transportadora',
        service: result.service,
        price: result.price,
        delivery_days: result.deadline,
      };

      setShippingOptions([option]);
      setSelectedShipping(option);
    } catch (err) {
      setShippingError(err.message || 'Erro ao calcular frete');
    } finally {
      setCalculatingShipping(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('status') === 'success') {
      setDone(urlParams.get('order') || 'AYA-CONFIRMED');
      clear();
    }
    if (window.self !== window.top) {
      setIframeBlocked(true);
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const order_number = 'AYA-' + Date.now().toString().slice(-8);

    if (!selectedShipping) {
      setError('Calcule o frete antes de finalizar');
      setSubmitting(false);
      return;
    }

    try {
      // Simulação de processamento local ou integração direta via fetch/API própria
      const orderPayload = {
        ...form,
        order_number,
        items: items.map((i) => ({ product_id: i.product_id, name: i.name, price: i.price, quantity: i.quantity })),
        subtotal,
        shipping_cost: shippingCost,
        discount: 0,
        total,
        status: 'pending',
        payment_method: paymentMethod,
      };

      // Simulação de salvamento e redirecionamento de pagamento
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Exemplo de redirecionamento simulado de sucesso (substitua pela sua URL de gateway real se houver)
      const origin = window.location.origin;
      const successUrl = `${origin}/checkout?status=success&order=${order_number}`;
      
      // Caso queira redirecionar para uma API real de pagamento:
      window.location.href = successUrl;
    } catch (err) {
      setError(err.message || 'Erro ao processar pagamento');
      setSubmitting(false);
    }
  };

  if (iframeBlocked) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-primary mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-display text-3xl mb-4">Checkout indisponível</h1>
          <p className="text-muted-foreground mb-8">O checkout só funciona na loja publicada, não na pré-visualização. Abra em uma nova aba para finalizar a compra.</p>
          <Link to="/colecao" className="text-primary border-b border-primary pb-1">Voltar à coleção</Link>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-8">
            <Check className="w-8 h-8" strokeWidth={1.25} />
          </div>
          <h1 className="font-display text-4xl mb-4">Pagamento Confirmado</h1>
          <p className="text-muted-foreground mb-2">Seu pedido foi processado com sucesso.</p>
          <p className="font-mono text-sm tracking-wider text-primary mb-10">{done}</p>
          <Link to="/colecao" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xs tracking-[0.15em] uppercase">
            Continuar Comprando
          </Link>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-muted-foreground mb-6">Sua sacola está vazia.</p>
          <Link to="/colecao" className="text-primary border-b border-primary pb-1">Explorar coleção</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-32 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <Lock className="w-3 h-3" /> Checkout Seguro
          </div>
          <h1 className="font-display text-4xl md:text-5xl">Finalizar Compra</h1>
        </div>

        <form onSubmit={submit} className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-10">
            <section>
              <h2 className="font-display text-2xl mb-5">Contato</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nome completo" value={form.customer_name} onChange={set('customer_name')} required />
                <Field label="E-mail" type="email" value={form.customer_email} onChange={set('customer_email')} required />
                <Field label="Telefone" value={form.customer_phone} onChange={set('customer_phone')} />
                <Field label="CPF" value={form.document_cpf} onChange={set('document_cpf')} />
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl mb-5">Entrega</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 flex gap-3">
                  <div className="flex-1">
                    <Field label="CEP" value={form.shipping_zipcode} onChange={set('shipping_zipcode')} required placeholder="00000-000" maxLength={9} />
                  </div>
                  <button
                    type="button"
                    onClick={handleCalculateShipping}
                    disabled={calculatingShipping || items.length === 0}
                    className="self-end px-6 py-3 text-xs tracking-[0.15em] uppercase border micro-border hover:border-primary transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {calculatingShipping ? 'Calculando…' : 'Calcular Frete'}
                  </button>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Endereço" value={form.shipping_address} onChange={set('shipping_address')} required />
                </div>
                <Field label="Cidade" value={form.shipping_city} onChange={set('shipping_city')} required />
                <Field label="Estado" value={form.shipping_state} onChange={set('shipping_state')} required />
              </div>
              {shippingError && (
                <p className="text-sm text-destructive mt-3">{shippingError}</p>
              )}
              {shippingOptions.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-xs tracking-wide text-muted-foreground">Opções de frete</p>
                  {shippingOptions.map((opt, i) => (
                    <label key={i} className={`flex items-center justify-between border p-4 cursor-pointer transition-colors ${selectedShipping?.carrier_id === opt.carrier_id ? 'border-primary bg-secondary/30' : 'micro-border'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={selectedShipping?.carrier_id === opt.carrier_id} onChange={() => setSelectedShipping(opt)} className="accent-primary" />
                        <div>
                          <p className="text-sm">{opt.carrier} · {opt.service}</p>
                          <p className="text-xs text-muted-foreground">Entrega em {opt.delivery_days}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium">{format(opt.price)}</span>
                    </label>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display text-2xl mb-5">Pagamento</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${paymentMethod === 'stripe' ? 'border-primary bg-secondary/30' : 'micro-border'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} className="accent-primary" />
                  <div>
                    <p className="text-sm font-medium">Cartão de Crédito (Stripe)</p>
                    <p className="text-xs text-muted-foreground">Pagamento seguro com criptografia de nível bancário</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${paymentMethod === 'mercadopago' ? 'border-primary bg-secondary/30' : 'micro-border'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} className="accent-primary" />
                  <div>
                    <p className="text-sm font-medium">Mercado Pago</p>
                    <p className="text-xs text-muted-foreground">Pix, cartão ou boleto via Mercado Pago</p>
                  </div>
                </label>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-2">
            <div className="bg-secondary/30 p-8 sticky top-32">
              <h2 className="font-display text-2xl mb-6">Resumo</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto hide-scrollbar">
                {items.map((i) => (
                  <div key={i.product_id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{i.quantity}× {i.name}</span>
                    <span>{format(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t micro-border pt-4 space-y-3 text-sm">
                <Row label="Subtotal" value={format(subtotal)} />
                <Row label="Frete" value={selectedShipping ? format(shippingCost) : 'A calcular'} />
                <div className="flex justify-between pt-3 border-t micro-border">
                  <span className="font-display text-xl">Total</span>
                  <span className="font-display text-xl">{format(total)}</span>
                </div>
              </div>
              {error && (
                <div className="flex items-start gap-2 mt-6 p-4 border border-destructive/30 bg-destructive/5 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={submitting || !selectedShipping}
                className="w-full bg-primary text-primary-foreground py-4 mt-6 text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Processando…' : selectedShipping ? (paymentMethod === 'mercadopago' ? 'Pagar com Mercado Pago' : 'Pagar com Stripe') : 'Calcule o frete primeiro'}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs tracking-wide text-muted-foreground block mb-2">{label}</span>
      <input {...props} className="w-full bg-transparent border micro-border px-4 py-3 text-sm focus:border-primary outline-none transition-colors" />
    </label>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
