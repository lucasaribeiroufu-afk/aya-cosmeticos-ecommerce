import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Substitua esta simulação pela chamada real ao seu backend ou provedor de autenticação (ex: Supabase, Firebase)
      // Exemplo: await supabase.auth.signUp({ email, password, options: { data: { name } } });
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 border micro-border p-8 bg-card">
        <div className="text-center">
          <h2 className="text-xl font-semibold uppercase tracking-[0.15em]">Criar Conta</h2>
          <p className="text-xs text-muted-foreground mt-2">Preencha os dados abaixo para se cadastrar</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] block mb-2">Nome Completo</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Seu Nome"
            />
          </div>

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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-primary underline underline-offset-4">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
