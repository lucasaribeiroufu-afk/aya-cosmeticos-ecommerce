import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createClient } from '@base44/sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const base44 = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await base44.auth.signInWithEmailAndPassword(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 border micro-border p-8 bg-card">
        <div className="text-center">
          <h2 className="text-xl font-semibold uppercase tracking-[0.15em]">Entrar na Conta</h2>
          <p className="text-xs text-muted-foreground mt-2">Insira suas credenciais para continuar</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <div>
            <label className="text-xs uppercase tracking-[0.15em] block mb-2">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <Link to="/forgot-password" class="text-muted-foreground hover:underline">
              Esqueceu a senha?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-primary underline underline-offset-4">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
