import { Eye, EyeOff, Tag } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      // erro já tratado no contexto
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-accent-dark lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)',
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
            <Tag size={17} strokeWidth={2} />
          </div>
          <span className="font-display text-lg font-semibold text-white">Estoque Profissional</span>
        </div>

        <div className="relative max-w-md">
          <p className="font-display text-3xl font-medium leading-snug text-white text-balance">
            Cada peça, cada venda, cada entrada — organizadas em um só lugar.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Painel de controle de estoque feito para o ritmo de uma loja de roupas de verdade.
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-2xs uppercase tracking-widest text-white/40">
          <span>Produtos</span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span>Estoque</span>
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span>Vendas</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-paper px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-white lg:hidden">
              <Tag size={18} strokeWidth={2} />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink">Entrar</h1>
            <p className="mt-1 text-sm text-ink/50">Acesse o painel de controle da sua loja</p>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-4 p-6 sm:p-7">
            <div>
              <label className="label">Login</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@loja.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink/35 transition hover:text-ink/60"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="animate-fade-in rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-2xs text-ink/35 lg:text-left">
            Acesso restrito à equipe da loja.
          </p>
        </div>
      </div>
    </div>
  );
}
