import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background pt-24 pb-12 mt-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <div className="flex flex-col leading-none mb-6">
              <span className="font-display text-3xl">Aya</span>
              <span className="text-[0.625rem] tracking-[0.3em] uppercase text-background/60 mt-1">Cosméticos</span>
            </div>
            <p className="text-background/70 max-w-md leading-relaxed text-base">
              A ciência da poesia da sua pele. Cosméticos fabricados com precisão industrial e
              elegância botânica, de Uberlândia para o mundo.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-full border border-background/20 flex items-center justify-center hover:bg-background/10 transition-colors">
                <Instagram className="w-4 h-4" strokeWidth={1.25} />
              </a>
              <a href="mailto:contato@ayacosmeticos.com.br" aria-label="E-mail" className="w-11 h-11 rounded-full border border-background/20 flex items-center justify-center hover:bg-background/10 transition-colors">
                <Mail className="w-4 h-4" strokeWidth={1.25} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/50 mb-5 font-body">Navegação</h4>
            <ul className="space-y-3 text-background/80">
              <li><Link to="/colecao" className="hover:text-background transition-colors">Coleção</Link></li>
              <li><Link to="/#ciencia" className="hover:text-background transition-colors">A Ciência</Link></li>
              <li><Link to="/#ritual" className="hover:text-background transition-colors">O Ritual</Link></li>
              <li><Link to="/admin" className="hover:text-background transition-colors">Painel Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/50 mb-5 font-body">Contato</h4>
            <ul className="space-y-3 text-background/80 text-sm leading-relaxed">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={1.25} />
                <span>Av. Comendador Alexandrino Garcia, 821<br />Uberlândia — MG, 38402-228</span>
              </li>
              <li>CNPJ 08.067.672/0001-26</li>
              <li>contato@ayacosmeticos.com.br</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/50">
          <p>© {new Date().getFullYear()} Aya Indústria e Comércio de Cosméticos Ltda. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link to="/colecao" className="hover:text-background transition-colors">Privacidade</Link>
            <Link to="/colecao" className="hover:text-background transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
