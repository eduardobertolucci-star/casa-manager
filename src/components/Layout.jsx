import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Calendar, CreditCard, Home, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/assets', icon: Package, label: 'Ativos' },
  { to: '/timeline', icon: Calendar, label: 'Linha do Tempo' },
  { to: '/payments', icon: CreditCard, label: 'Parcelas' },
]

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-zinc-900 flex">

      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-64 bg-zinc-800 border-r border-zinc-700 flex-col">
        <div className="p-6 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Home size={18} className="text-indigo-200" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">Casa Manager</h1>
              <p className="text-zinc-400 text-xs">Gestão de ativos</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-700 space-y-3">
          <div className="flex items-center gap-2">
            {user?.photoURL
              ? <img src={user.photoURL} className="w-7 h-7 rounded-full" />
              : <div className="w-7 h-7 rounded-full bg-indigo-600" />}
            <p className="text-zinc-400 text-xs truncate">{user?.displayName}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-500 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-800 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Home size={14} className="text-indigo-200" />
            </div>
            <h1 className="text-white font-bold text-sm">Casa Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            {user?.photoURL && <img src={user.photoURL} className="w-7 h-7 rounded-full" />}
            <button onClick={logout} className="p-1.5 text-zinc-500 hover:text-white transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Bottom nav — mobile only */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 flex">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-zinc-500'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span className="leading-none">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
