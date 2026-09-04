import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Trash2, Edit2, ChevronRight, Package } from 'lucide-react'
import { useAssetsContext } from '../context/AssetsContext'
import { getCurrentValue, getDepreciationPercent, formatCurrency, getYearsRemaining } from '../utils/depreciation'
import HealthBadge from '../components/HealthBadge'
import { CATEGORIES } from '../data/categories'

export default function Assets() {
  const { assets, deleteAsset } = useAssetsContext()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || a.categoryKey === filterCat
    return matchSearch && matchCat
  })

  const handleDelete = (id, name) => {
    if (confirm(`Remover "${name}"?`)) deleteAsset(id)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Ativos</h2>
          <p className="text-zinc-400 text-sm">{assets.length} item(s) cadastrado(s)</p>
        </div>
        <Link
          to="/assets/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Novo Ativo
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar ativo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">Todas as categorias</option>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map(asset => {
          const depPct = getDepreciationPercent(asset)
          const currentValue = getCurrentValue(asset)
          const yearsLeft = getYearsRemaining(asset)
          return (
            <div key={asset.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white text-sm font-medium truncate">{asset.name}</p>
                  <HealthBadge depreciationPct={depPct} />
                </div>
                <p className="text-zinc-400 text-xs">
                  {CATEGORIES[asset.categoryKey]?.label} · {CATEGORIES[asset.categoryKey]?.subcategories[asset.subcategoryKey]?.label}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-zinc-300 text-xs">{formatCurrency(currentValue)} atual</span>
                  <span className="text-zinc-500 text-xs">{depPct.toFixed(0)}% depreciado</span>
                  <span className="text-zinc-500 text-xs">
                    {yearsLeft <= 0
                      ? 'Fim de vida'
                      : yearsLeft < 1
                      ? `${Math.round(yearsLeft * 12)}m restantes`
                      : `${yearsLeft.toFixed(1)}a restantes`}
                  </span>
                </div>
                {/* Depreciation bar */}
                <div className="mt-2 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${depPct < 30 ? 'bg-emerald-500' : depPct < 60 ? 'bg-yellow-500' : depPct < 85 ? 'bg-orange-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(depPct, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to={`/assets/${asset.id}/edit`}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Edit2 size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(asset.id, asset.name)}
                  className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <Trash2 size={15} />
                </button>
                <Link
                  to={`/assets/${asset.id}`}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Package size={36} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-zinc-400 text-sm">Nenhum ativo encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
