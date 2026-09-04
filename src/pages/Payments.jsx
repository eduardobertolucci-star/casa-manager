import { Link } from 'react-router-dom'
import { CreditCard, CheckCircle } from 'lucide-react'
import { useAssetsContext } from '../context/AssetsContext'
import { getInstallmentStatus, formatCurrency } from '../utils/depreciation'
import { CATEGORIES } from '../data/categories'

export default function Payments() {
  const { assets } = useAssetsContext()

  const withInstallments = assets.filter(a => a.installments)
  const active = withInstallments.filter(a => !getInstallmentStatus(a).isComplete)
  const completed = withInstallments.filter(a => getInstallmentStatus(a).isComplete)

  const totalMonthly = active.reduce((sum, a) => sum + a.installments.monthlyValue, 0)
  const totalRemaining = active.reduce((sum, a) => sum + getInstallmentStatus(a).remainingAmount, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Parcelamentos</h2>
        <p className="text-zinc-400 text-sm">{withInstallments.length} item(s) parcelado(s)</p>
      </div>

      {active.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            <p className="text-zinc-400 text-xs mb-1">Comprometimento mensal</p>
            <p className="text-indigo-400 text-xl font-bold">{formatCurrency(totalMonthly)}</p>
          </div>
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            <p className="text-zinc-400 text-xs mb-1">Total a pagar</p>
            <p className="text-yellow-400 text-xl font-bold">{formatCurrency(totalRemaining)}</p>
          </div>
        </div>
      )}

      {/* Active installments */}
      {active.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-zinc-300 text-sm font-semibold">Em andamento ({active.length})</h3>
          {active.map(asset => {
            const status = getInstallmentStatus(asset)
            const progress = (status.paid / status.total) * 100
            return (
              <div key={asset.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Link
                      to={`/assets/${asset.id}`}
                      className="text-white text-sm font-medium hover:text-indigo-400 transition-colors"
                    >
                      {asset.name}
                    </Link>
                    <p className="text-zinc-400 text-xs">{CATEGORIES[asset.categoryKey]?.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-400 text-sm font-semibold">
                      {formatCurrency(asset.installments.monthlyValue)}
                      <span className="text-zinc-500 text-xs">/mês</span>
                    </p>
                    <p className="text-zinc-500 text-xs">{status.paid}/{status.total} pagas</p>
                  </div>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs">
                    <span className="text-emerald-400">{formatCurrency(status.paidAmount)} pago</span>
                    <span className="text-yellow-400">{formatCurrency(status.remainingAmount)} restante</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-zinc-300 text-sm font-semibold">Quitados ({completed.length})</h3>
          {completed.map(asset => (
            <Link
              key={asset.id}
              to={`/assets/${asset.id}`}
              className="flex items-center gap-3 p-3 bg-zinc-800 border border-zinc-700 rounded-xl opacity-60 hover:opacity-100 transition-opacity"
            >
              <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white text-sm">{asset.name}</p>
                <p className="text-zinc-500 text-xs">
                  {formatCurrency(getInstallmentStatus(asset).totalAmount)} quitado
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {withInstallments.length === 0 && (
        <div className="text-center py-24">
          <CreditCard size={40} className="mx-auto text-zinc-600 mb-3" />
          <p className="text-zinc-400 text-sm">Nenhum item parcelado cadastrado.</p>
          <Link to="/assets/new" className="inline-block mt-2 text-indigo-400 text-sm hover:text-indigo-300">
            Adicionar ativo parcelado →
          </Link>
        </div>
      )}
    </div>
  )
}
