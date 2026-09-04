import { Link } from 'react-router-dom'
import { Plus, AlertTriangle, TrendingDown, CreditCard, Package } from 'lucide-react'
import { useAssetsContext } from '../context/AssetsContext'
import {
  getCurrentValue, getDepreciationPercent, getYearsRemaining,
  formatCurrency, getInstallmentStatus
} from '../utils/depreciation'
import HealthBadge from '../components/HealthBadge'
import { CATEGORIES } from '../data/categories'

export default function Dashboard() {
  const { assets } = useAssetsContext()

  const totalCurrentValue = assets.reduce((sum, a) => sum + getCurrentValue(a), 0)
  const totalPurchaseValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0)
  const totalDepreciation = totalPurchaseValue - totalCurrentValue

  const criticalAssets = assets.filter(a => getDepreciationPercent(a) >= 60)

  const upcomingReplacements = assets
    .map(a => ({ ...a, yearsRemaining: getYearsRemaining(a), depPct: getDepreciationPercent(a) }))
    .filter(a => a.yearsRemaining <= 3 && a.yearsRemaining > 0)
    .sort((a, b) => a.yearsRemaining - b.yearsRemaining)

  const activeInstallments = assets.filter(a => {
    const s = getInstallmentStatus(a)
    return s && !s.isComplete
  })
  const monthlyCommitment = activeInstallments.reduce((sum, a) => sum + (a.installments?.monthlyValue || 0), 0)

  const summaryCards = [
    { label: 'Total de Ativos', value: assets.length, sub: 'itens cadastrados', icon: Package, color: 'text-indigo-400' },
    { label: 'Valor Atual', value: formatCurrency(totalCurrentValue), sub: `de ${formatCurrency(totalPurchaseValue)} investidos`, icon: TrendingDown, color: 'text-emerald-400' },
    { label: 'Depreciação Total', value: formatCurrency(totalDepreciation), sub: `${totalPurchaseValue > 0 ? ((totalDepreciation / totalPurchaseValue) * 100).toFixed(1) : 0}% do patrimônio`, icon: TrendingDown, color: 'text-orange-400' },
    { label: 'Atenção / Crítico', value: criticalAssets.length, sub: 'ativos precisam de atenção', icon: AlertTriangle, color: 'text-red-400' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-bold">Dashboard</h2>
          <p className="text-zinc-400 text-sm">Visão geral dos seus ativos domésticos</p>
        </div>
        <Link
          to="/assets/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Novo Ativo
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-zinc-400 text-xs mb-1">{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-zinc-500 text-xs mt-1">{card.sub}</p>
              </div>
              <card.icon size={20} className={`${card.color} opacity-60`} />
            </div>
          </div>
        ))}
      </div>

      {/* Monthly commitment */}
      {activeInstallments.length > 0 && (
        <div className="bg-zinc-800 border border-indigo-600 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-indigo-400" />
              <span className="text-white text-sm font-medium">Comprometimento Mensal</span>
            </div>
            <div className="text-right">
              <p className="text-indigo-400 font-bold text-lg">{formatCurrency(monthlyCommitment)}</p>
              <p className="text-zinc-400 text-xs">{activeInstallments.length} parcelamento(s) ativo(s)</p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming replacements */}
      {upcomingReplacements.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-400" />
            Substituições nos próximos 3 anos
          </h3>
          <div className="space-y-2">
            {upcomingReplacements.slice(0, 5).map(asset => (
              <Link
                key={asset.id}
                to={`/assets/${asset.id}`}
                className="flex items-center justify-between p-2.5 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
              >
                <div>
                  <p className="text-white text-sm font-medium">{asset.name}</p>
                  <p className="text-zinc-400 text-xs">{CATEGORIES[asset.categoryKey]?.label}</p>
                </div>
                <div className="text-right">
                  <HealthBadge depreciationPct={asset.depPct} />
                  <p className="text-zinc-400 text-xs mt-1">
                    {asset.yearsRemaining < 1
                      ? `${Math.round(asset.yearsRemaining * 12)} meses`
                      : `${asset.yearsRemaining.toFixed(1)} anos`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {upcomingReplacements.length > 5 && (
            <Link to="/timeline" className="block text-center text-indigo-400 text-xs mt-3 hover:text-indigo-300">
              Ver todos ({upcomingReplacements.length})
            </Link>
          )}
        </div>
      )}

      {/* Critical assets */}
      {criticalAssets.length > 0 && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            Ativos críticos
          </h3>
          <div className="space-y-2">
            {criticalAssets.slice(0, 4).map(asset => {
              const depPct = getDepreciationPercent(asset)
              return (
                <Link
                  key={asset.id}
                  to={`/assets/${asset.id}`}
                  className="flex items-center justify-between p-2.5 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{asset.name}</p>
                    <p className="text-zinc-400 text-xs">{formatCurrency(getCurrentValue(asset))} valor atual</p>
                  </div>
                  <div className="text-right">
                    <HealthBadge depreciationPct={depPct} />
                    <p className="text-zinc-500 text-xs mt-1">{depPct.toFixed(0)}% depreciado</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {assets.length === 0 && (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto text-zinc-600 mb-4" />
          <p className="text-zinc-400 text-sm">Nenhum ativo cadastrado ainda.</p>
          <Link to="/assets/new" className="inline-block mt-3 text-indigo-400 text-sm hover:text-indigo-300">
            Cadastrar primeiro ativo →
          </Link>
        </div>
      )}
    </div>
  )
}
