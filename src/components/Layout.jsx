import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, Calendar, CreditCard, Home } from 'lucide-react'

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/assets', icon: Package, label: 'Ativos' },
  { to: '/timeline', icon: Calendar, label: 'Linha do Tempo' },
  { to: '/payments', icon: CreditCard, label: 'Parcelamentos' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-900 flex">
      <aside className="w-64 bg-zinc-800 border-r border-zinc-700 flex flex-col">
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
        <div className="p-4 border-t border-zinc-700">
          <p className="text-zinc-500 text-xs text-center">Depreciação por normas técnicas</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
