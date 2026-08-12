import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function OAuthConsent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const clientName = searchParams.get('client_name') || 'Aplicativo Externo';
  const scope = searchParams.get('scope') || 'acesso básico à conta';

  const handleAuthorize = async (approved) => {
    setLoading(true);
    setError('');
    
    try {
      // Substitua esta lógica pela chamada real ao seu endpoint de consentimento OAuth no backend
      // Exemplo:
      // await fetch('/api/oauth/consent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ approved, client_name: clientName, scope })
      // });

      await new Promise((resolve) => setTimeout(resolve, 800));
      
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao processar a autorização');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 border micro-border p-8 bg-card">
        <div className="text-center">
          <h2 className="text-xl font-semibold uppercase tracking-[0.15em]">Autorização de Acesso</h2>
          <p className="text-xs text-muted-foreground mt-2">
            <strong className="text-foreground">{clientName}</strong> está solicitando permissão para acessar sua conta.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 border border-destructive/20">
            {error}
          </div>
        )}

        <div className="border micro-border p-4 bg-secondary/10 space-y-2">
          <span className="text-xs uppercase tracking-[0.15em] font-medium block">Permissões solicitadas:</span>
          <p className="text-xs text-muted-foreground">{scope}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <Button 
            onClick={() => handleAuthorize(true)} 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Processando...' : 'Autorizar'}
          </Button>

          <Button 
            onClick={() => handleAuthorize(false)} 
            variant="outline" 
            className="w-full" 
            disabled={loading}
          >
            Negar
          </Button>
        </div>
      </div>
    </div>
  );
}
