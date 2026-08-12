import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@base44/sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const base44 = createClient();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await base44.auth.requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erro ao enviar e-mail de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 border micro-border p-8 bg-card">
        <div className="text-center">
          <h2 className="text-xl font-semibold uppercase tracking-[0.15em]">Recuperar Senha</h2>
          <p className="text-xs text-muted-foreground mt-2">Enviaremos instruções para o seu e-mail</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 border border-destructive/20">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <div className="bg-primary/10 text-primary text-xs p-4 border border-primary/20">
              E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.
            </div>
            <Link to="/login">
              <Button className="w-full mt-4">Voltar para o Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.15em] block mb-2">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Instruções'}
            </Button>

            <div className="text-center text-xs text-muted-foreground pt-2">
              Lembrou a senha?{' '}
              <Link to="/login" className="text-primary underline underline-offset-4">
                Entrar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
