import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createClient } from '@base44/sdk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const base44 = createClient();

  const token = searchParams.get('token');

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await base44.auth.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Erro ao redefinir a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 border micro-border p-8 bg-card">
        <div className="text-center">
          <h2 className="text-xl font-semibold uppercase tracking-[0.15em]">Nova Senha</h2>
          <p className="text-xs text-muted-foreground mt-2">Insira sua nova senha abaixo</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 border border-destructive/20">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <div className="bg-primary/10 text-primary text-xs p-4 border border-primary/20">
              Senha redefinida com sucesso! Redirecionando para o login...
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-[0.15em] block mb-2">Nova Senha</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.15em] block mb-2">Confirmar Nova Senha</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Salvando...' : 'Redefinir Senha'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
