import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, FlaskConical, ShieldCheck, Sparkles } from 'lucide-react';
import { Image } from '@/components/ui/image';
import ProductCard from '@/components/store/ProductCard';

const HERO_IMG = "https://media.base44.com/images/public/6a6cbc5e6576c73c3848bac8/49ae14c4c_generated_b1360695.png";
const LAB_IMG = "https://media.base44.com/images/public/6a6cbc5e6576c73c3848bac8/234bcc091_generated_53627b35.png";
const MODEL_IMG = "https://media.base44.com/images/public/6a6cbc5e6576c73c3848bac8/53e3c5a7b_generated_7d544b3a.png";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula a busca de produtos em destaque localmente (substitua por fetch('/api/products?featured=true') se necessário)
    const fetchFeaturedProducts = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProducts([
          {
            id: 1,
            name: 'Sérum Facial Rejuvenescedor',
            slug: 'serum-facial-rejuvenescedor',
            subtitle: 'Alta performance antioxidante',
            price: 129.90,
            image_url: 'https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png',
            category: 'Skincare',
            featured: true,
            active: true
          },
          {
            id: 2,
            name: 'Hidratante Corporal Nutritivo',
            slug: 'hidratante-corporal-nutritivo',
            subtitle: 'Nutrição intensa prolongada',
            price: 89.90,
            image_url: 'https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png',
            category: 'Corpo',
            featured: true,
            active: true
          }
        ]);
      } catch (err) {
        console.error('Erro ao carregar produtos em destaque', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="pt-28">
      {/* HERO */}
      <section className="min-h-[88vh] flex items-stretch">
        <div className="w-full md:w-1/2 relative bg-muted">
          <Image src={HERO_IMG} alt="Textura de creme cosmético Aya" fittingType="fill" className="w-full h-full min-h-[60vh] md:min-h-[88vh]" />
        </div>
        <div className="w-full md:w-1/2 flex items-center px-6 md:px-16 lg:px-24 py-20">
          <div className="max-w-lg">
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-6">Fabricação cosmética · Uberlândia, MG</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
              Aya: a ciência<br />da poesia<br />da sua pele.
            </h1>
            <p className="text-muted-foreground mt-8 text-lg leading-relaxed max-w-md">
              Cosméticos criados com precisão industrial e elegância botânica. Da fábrica ao
              seu ritual, cada fórmula é uma promessa de transformação.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/colecao" className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors">
                Explorar Coleção
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.25} />
              </Link>
              <a href="#ciencia" className="inline-flex items-center px-8 py-4 text-xs tracking-[0.15em] uppercase border micro-border hover:border-primary transition-colors">
                Nossa Ciência
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y micro-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { icon: Leaf, label: 'Botânico & Consciente' },
            { icon: FlaskConical, label: 'CNAE 2063-1/00' },
            { icon: ShieldCheck, label: 'Dermatologicamente Testado' },
            { icon: Sparkles, label: 'Da Fábrica ao Rosto' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-6 justify-center">
              <Icon className="w-5 h-5 text-primary" strokeWidth={1} />
              <span className="text-sm text-muted-foreground tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="breathing-section max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">A Coleção</p>
            <h2 className="font-display text-4xl md:text-5xl">Fórmulas Selecionadas</h2>
          </div>
          <Link to="/colecao" className="group inline-flex items-center gap-2 text-sm border-b border-primary text-primary pb-1 self-start md:self-auto">
            Ver tudo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.25} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <div className="skeleton aspect-[3/4] w-full" />
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-6 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* SCIENCE */}
      <section id="ciencia" className="breathing-section bg-secondary/40">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-[4/3] bg-muted overflow-hidden">
            <Image src={LAB_IMG} alt="Laboratório boutique Aya" fittingType="fill" className="w-full h-full" />
          </div>
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary mb-6">Da Fábrica ao Rosto</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-8 text-balance">
              Manufatura de microempresa, excelência de laboratório.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Como uma indústria de cosméticos certificada (CNAE C-2063-1/00), controlamos cada
              etapa — da seleção de ativos ao envase — com o cuidado de uma microempresa que
              trata cada fórmula como única.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-display text-4xl text-primary">2006</p>
                <p className="text-sm text-muted-foreground mt-1">Fundada em Uberlândia</p>
              </div>
              <div>
                <p className="font-display text-4xl text-primary">100%</p>
                <p className="text-sm text-muted-foreground mt-1">Rastreabilidade de fórmula</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RITUAL */}
      <section id="ritual" className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-muted">
          <Image src={MODEL_IMG} alt="Pele luminosa" fittingType="fill" className="w-full h-full" />
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-xl text-background">
            <p className="text-xs tracking-[0.3em] uppercase mb-6">O Ritual</p>
            <h2 className="font-display text-4xl md:text-6xl leading-tight text-balance">
              A pele não se trata. Cultiva-se.
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-background/90">
              Um ritual diário de intenção. Cada gesto, uma cerimônia de presença.
            </p>
            <Link to="/colecao" className="inline-flex items-center gap-3 mt-10 bg-background text-foreground px-8 py-4 text-xs tracking-[0.15em] uppercase hover:bg-background/90 transition-colors">
              Iniciar seu ritual
              <ArrowRight className="w-4 h-4" strokeWidth={1.25} />
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="breathing-section max-w-2xl mx-auto px-6 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Comunidade Aya</p>
        <h2 className="font-display text-4xl md:text-5xl mb-6 text-balance">Receba os rituais e lançamentos</h2>
        <p className="text-muted-foreground mb-8">Inscreva-se para acesso antecipado a fórmulas, edições limitadas e conteúdo educativo.</p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="seu@email.com"
            className="flex-1 bg-transparent border micro-border px-5 py-4 text-sm focus:border-primary outline-none"
          />
          <button type="submit" className="bg-primary text-primary-foreground px-8 py-4 text-xs tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors">
            Inscrever
          </button>
        </form>
      </section>
    </main>
  );
}
