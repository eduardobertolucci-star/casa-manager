import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, Trash2, Calendar, Tag, DollarSign, Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAssetsContext } from '../context/AssetsContext'
import {
  getCurrentValue, getDepreciationPercent, getDepreciationTimeline,
  getYearsRemaining, getEndOfLifeDate, getInstallmentStatus,
  formatCurrency, formatDate, HEALTH_CONFIG, getHealthStatus
} from '../utils/depreciation'
import HealthBadge from '../components/HealthBadge'
import { CATEGORIES } from '../data/categories'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-2.5 text-xs">
      <p className="text-zinc-400">{label}</p>
      <p className="text-indigo-400 font-semibold">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function AssetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getAsset, deleteAsset } = useAssetsContext()
  const asset = getAsset(id)

  if (!asset) {
    return (
      <div className="p-6 text-center py-24">
        <p className="text-zinc-400">Ativo não encontrado.{' '}
          <Link to="/assets" className="text-indigo-400">Voltar</Link>
        </p>
      </div>
    )
  }

  const depPct = getDepreciationPercent(asset)
  const currentValue = getCurrentValue(asset)
  const yearsLeft = getYearsRemaining(asset)
  const endDate = getEndOfLifeDate(asset)
  const timeline = getDepreciationTimeline(asset)
  const installStatus = getInstallmentStatus(asset)
  const healthCfg = HEALTH_CONFIG[getHealthStatus(depPct)]
  const annualDep = (asset.purchasePrice - asset.purchasePrice * asset.residualPct) / asset.usefulLifeYears

  const handleDelete = () => {
    if (confirm(`Remover "${asset.name}"? Esta ação não pode ser desfeita.`)) {
      deleteAsset(id)
      navigate('/assets')
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/assets"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-white text-xl font-bold">{asset.name}</h2>
              <HealthBadge depreciationPct={depPct} />
            </div>
            <p className="text-zinc-400 text-sm">
              {asset.brand && `${asset.brand} · `}
              {CATEGORIES[asset.categoryKey]?.label}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Link
            to={`/assets/${id}/edit`}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Value cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center">
          <p className="text-zinc-400 text-xs mb-1">Valor de compra</p>
          <p className="text-white text-sm font-bold">{formatCurrency(asset.purchasePrice)}</p>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center">
          <p className="text-zinc-400 text-xs mb-1">Valor atual</p>
          <p className={`text-sm font-bold ${healthCfg.color}`}>{formatCurrency(currentValue)}</p>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-center">
          <p className="text-zinc-400 text-xs mb-1">Depreciado</p>
          <p className="text-orange-400 text-sm font-bold">{depPct.toFixed(1)}%</p>
        </div>
      </div>

      {/* Life bar */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span>Vida útil consumida</span>
          <span>
            {yearsLeft > 0
              ? `${yearsLeft.toFixed(1)} anos restantes`
              : 'Fim de vida útil'}
          </span>
        </div>
        <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${depPct < 30 ? 'bg-emerald-500' : depPct < 60 ? 'bg-yellow-500' : depPct < 85 ? 'bg-orange-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(depPct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-1.5">
          <span>{formatDate(asset.purchaseDate)}</span>
          <span>{endDate.toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {/* Depreciation chart */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
        <h3 className="text-white text-sm font-semibold mb-4">Curva de depreciação</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={timeline} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="depGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              fill="url(#depGrad)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-2 flex gap-3 text-xs text-zinc-500 justify-center flex-wrap">
          <span>Método: {asset.depreciationMethod === 'declining' ? 'Acelerada (DDB)' : 'Linear'}</span>
          <span>·</span>
          <span>Vida útil: {asset.usefulLifeYears} anos</span>
          <span>·</span>
          <span>Residual: {(asset.residualPct * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex items-center gap-2.5">
          <Calendar size={15} className="text-zinc-400" />
          <div>
            <p className="text-zinc-500 text-xs">Comprado em</p>
            <p className="text-white text-sm">{formatDate(asset.purchaseDate)}</p>
          </div>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex items-center gap-2.5">
          <Clock size={15} className="text-zinc-400" />
          <div>
            <p className="text-zinc-500 text-xs">Substituir em</p>
            <p className="text-white text-sm">{endDate.toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex items-center gap-2.5">
          <Tag size={15} className="text-zinc-400" />
          <div>
            <p className="text-zinc-500 text-xs">Tipo</p>
            <p className="text-white text-sm">{CATEGORIES[asset.categoryKey]?.subcategories[asset.subcategoryKey]?.label}</p>
          </div>
        </div>
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 flex items-center gap-2.5">
          <DollarSign size={15} className="text-zinc-400" />
          <div>
            <p className="text-zinc-500 text-xs">Depreciação/ano</p>
            <p className="text-white text-sm">{formatCurrency(annualDep)}</p>
          </div>
        </div>
      </div>

      {/* Installments */}
      {installStatus && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
          <h3 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <DollarSign size={15} className="text-indigo-400" />
            Parcelamento
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">{installStatus.paid}/{installStatus.total} parcelas pagas</span>
              <span className={installStatus.isComplete ? 'text-emerald-400' : 'text-indigo-400'}>
                {installStatus.isComplete ? 'Quitado!' : `${formatCurrency(asset.installments.monthlyValue)}/mês`}
              </span>
            </div>
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${(installStatus.paid / installStatus.total) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-zinc-400">Pago</p>
                <p className="text-emerald-400 font-semibold">{formatCurrency(installStatus.paidAmount)}</p>
              </div>
              <div>
                <p className="text-zinc-400">Restante</p>
                <p className="text-yellow-400 font-semibold">{formatCurrency(installStatus.remainingAmount)}</p>
              </div>
              <div>
                <p className="text-zinc-400">Total</p>
                <p className="text-white font-semibold">{formatCurrency(installStatus.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      {asset.notes && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
          <p className="text-zinc-400 text-xs font-medium mb-1">Observações</p>
          <p className="text-zinc-300 text-sm">{asset.notes}</p>
        </div>
      )}
    </div>
  )
}
