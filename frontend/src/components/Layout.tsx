import { LayoutDashboard, LogOut, PackagePlus, Receipt, Tag } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from './ui/ConfirmProvider';

const navItems = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/produtos', label: 'Produtos', icon: Tag },
  { to: '/vendas', label: 'Vendas', icon: Receipt },
  { to: '/estoque', label: 'Estoque', icon: PackagePlus },
];

function initials(email?: string) {
  if (!email) return '?';
  const name = email.split('@')[0];
  return name.slice(0, 2).toUpperCase();
}

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const confirm = useConfirm();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLabel = navItems.find((item) => (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)))?.label ?? '';

  async function handleLogout() {
    setMenuOpen(false);
    const ok = await confirm({
      title: 'Sair da conta?',
      description: 'Você precisará entrar novamente para acessar o painel.',
      confirmLabel: 'Sair',
      variant: 'danger',
    });
    if (ok) logout();
  }

  return (
    <div className="min-h-screen bg-paper lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line-soft bg-surface/60 lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-white">
            e.
          </div>
          <div>
            <p className="font-display text-base font-semibold leading-none text-ink">Estoque Profissional</p>
            <p className="mt-1 text-2xs uppercase tracking-wider text-ink/40">Loja de roupas</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={17} strokeWidth={2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="mx-4 mb-4 stitch-divider" />

        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-dark">
              {initials(user?.email)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{user?.email}</p>
              <p className="text-2xs text-ink/40">Conectado</p>
            </div>
            <button onClick={handleLogout} className="icon-btn" aria-label="Sair">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between border-b border-line-soft bg-surface/80 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-semibold text-white">
              e.
            </div>
            <span className="font-display text-sm font-semibold text-ink">{currentLabel || 'Estoque Profissional'}</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-2xs font-semibold text-accent-dark"
            >
              {initials(user?.email)}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-30 w-52 animate-scale-in rounded-xl border border-line-soft bg-surface p-1.5 shadow-lift">
                  <div className="px-2.5 py-2">
                    <p className="truncate text-xs font-medium text-ink/70">{user?.email}</p>
                  </div>
                  <div className="mx-1 my-1 h-px bg-line-soft" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-danger transition hover:bg-danger-soft"
                  >
                    <LogOut size={15} />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 px-5 py-6 pb-24 sm:px-8 sm:py-8 lg:pb-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav — native app feel */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t border-line-soft bg-surface/95 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-2.5 text-2xs font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-ink/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 1.9} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
