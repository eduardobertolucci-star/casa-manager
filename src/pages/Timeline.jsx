import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { useAssetsContext } from '../context/AssetsContext'
import { getEndOfLifeDate, getDepreciationPercent, getHealthStatus, formatCurrency, HEALTH_CONFIG } from '../utils/depreciation'
import { CATEGORIES } from '../data/categories'

const BAR_COLORS = {
  good: '#10b981',      // emerald-500
  warning: '#eab308',   // yellow-500
  critical: '#f97316',  // orange-500
  end_of_life: '#ef4444', // red-500
}

export default function Timeline() {
  const { assets } = useAssetsContext()
  const [tooltip, setTooltip] = useState(null)

  if (assets.length === 0) {
    return (
      <div className="p-6 text-center py-24">
        <Package size={40} className="mx-auto text-zinc-600 mb-3" />
        <p className="text-zinc-400 text-sm">Nenhum ativo cadastrado.</p>
        <Link to="/assets/new" className="inline-block mt-2 text-indigo-400 text-sm hover:text-indigo-300">
          Cadastrar ativo →
        </Link>
      </div>
    )
  }

  const now = new Date()

  // Calculate time bounds
  const purchaseDates = assets.map(a => new Date(a.purchaseDate + 'T12:00:00'))
  const endDates = assets.map(a => getEndOfLifeDate(a))

  const rawMin = new Date(Math.min(...purchaseDates))
  const rawMax = new Date(Math.max(...endDates))

  // Snap to year boundaries with padding
  const startYear = Math.min(rawMin.getFullYear(), now.getFullYear() - 1)
  const endYear = Math.max(rawMax.getFullYear(), now.getFullYear() + 3) + 1

  const startDate = new Date(startYear, 0, 1)
  const endDate = new Date(endYear, 0, 1)
  const totalMs = endDate - startDate

  const toX = (date) => ((date - startDate) / totalMs) * 100

  const todayX = toX(now)

  // Build year ticks
  const years = []
  for (let y = startYear; y <= endYear; y++) years.push(y)

  // Group assets by category
  const grouped = {}
  assets.forEach(asset => {
    if (!grouped[asset.categoryKey]) grouped[asset.categoryKey] = []
    grouped[asset.categoryKey].push(asset)
  })

  const totalNext5y = assets
    .filter(a => {
      const y = getEndOfLifeDate(a).getFullYear()
      return y >= now.getFullYear() && y <= now.getFullYear() + 5
    })
    .reduce((sum, a) => sum + a.purchasePrice, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Linha do Tempo</h2>
        <p className="text-zinc-400 text-sm">Vida útil dos ativos ao longo do tempo</p>
      </div>

      {totalNext5y > 0 && (
        <div className="bg-zinc-800 border border-indigo-900 rounded-xl p-4">
          <p className="text-zinc-400 text-xs mb-1">Investimento previsto nos próximos 5 anos</p>
          <p className="text-indigo-400 text-2xl font-bold">{formatCurrency(totalNext5y)}</p>
          <p className="text-zinc-500 text-xs mt-1">baseado nos valores originais de compra</p>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        {Object.entries(HEALTH_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: BAR_COLORS[key] }} />
            <span className="text-zinc-400 text-xs">{cfg.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-0.5 h-3 bg-white/60" />
          <span className="text-zinc-400 text-xs">Hoje</span>
        </div>
      </div>

      {/* Gantt chart */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden">
        {/* X-axis header */}
        <div className="relative h-8 border-b border-zinc-700 ml-40">
          {years.map(y => {
            const x = toX(new Date(y, 0, 1))
            if (x < 0 || x > 100) return null
            return (
              <div
                key={y}
                className="absolute top-0 h-full flex items-center"
                style={{ left: `${x}%` }}
              >
                <span className="text-zinc-500 text-xs pl-1">{y}</span>
                <div className="absolute top-0 bottom-0 w-px bg-zinc-700/50" />
              </div>
            )
          })}
          {/* Today line in header */}
          <div
            className="absolute top-0 bottom-0 w-px bg-white/40"
            style={{ left: `${todayX}%` }}
          />
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-700/50">
          {Object.entries(grouped).map(([catKey, catAssets]) => (
            <div key={catKey}>
              {/* Category header */}
              <div className="flex items-center h-7 bg-zinc-700/30">
                <div className="w-40 flex-shrink-0 px-3">
                  <p className="text-zinc-400 text-xs font-semibold truncate">
                    {CATEGORIES[catKey]?.label}
                  </p>
                </div>
                <div className="flex-1 relative">
                  {years.map(y => {
                    const x = toX(new Date(y, 0, 1))
                    return (
                      <div key={y} className="absolute top-0 bottom-0 w-px bg-zinc-700/30" style={{ left: `${x}%` }} />
                    )
                  })}
                  <div className="absolute top-0 bottom-0 w-px bg-white/20" style={{ left: `${todayX}%` }} />
                </div>
              </div>

              {/* Asset rows */}
              {catAssets.map(asset => {
                const purchase = new Date(asset.purchaseDate + 'T12:00:00')
                const end = getEndOfLifeDate(asset)
                const depPct = getDepreciationPercent(asset)
                const health = getHealthStatus(depPct)
                const barLeft = Math.max(0, toX(purchase))
                const barRight = Math.min(100, toX(end))
                const barWidth = barRight - barLeft

                return (
                  <div key={asset.id} className="flex items-center h-10 hover:bg-zinc-700/20 transition-colors">
                    {/* Label */}
                    <div className="w-40 flex-shrink-0 px-3">
                      <Link to={`/assets/${asset.id}`} className="text-zinc-300 text-xs truncate hover:text-indigo-400 transition-colors block">
                        {asset.name}
                      </Link>
                    </div>

                    {/* Bar area */}
                    <div className="flex-1 relative h-full flex items-center">
                      {/* Grid lines */}
                      {years.map(y => {
                        const x = toX(new Date(y, 0, 1))
                        return (
                          <div key={y} className="absolute top-0 bottom-0 w-px bg-zinc-700/30" style={{ left: `${x}%` }} />
                        )
                      })}

                      {/* Today line */}
                      <div className="absolute top-0 bottom-0 w-px bg-white/40 z-10" style={{ left: `${todayX}%` }} />

                      {/* Bar */}
                      {barWidth > 0 && (
                        <div
                          className="absolute h-5 rounded cursor-pointer transition-opacity hover:opacity-80"
                          style={{
                            left: `${barLeft}%`,
                            width: `${barWidth}%`,
                            backgroundColor: BAR_COLORS[health],
                            opacity: 0.85,
                          }}
                          onMouseEnter={e => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            setTooltip({
                              asset,
                              depPct,
                              health,
                              purchase,
                              end,
                              x: rect.left,
                              y: rect.top,
                            })
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-zinc-900 border border-zinc-600 rounded-xl p-3 shadow-xl text-xs pointer-events-none"
          style={{ left: tooltip.x + 8, top: tooltip.y - 80 }}
        >
          <p className="text-white font-semibold mb-1">{tooltip.asset.name}</p>
          <p className="text-zinc-400">
            {tooltip.purchase.toLocaleDateString('pt-BR')} → {tooltip.end.toLocaleDateString('pt-BR')}
          </p>
          <p className={`mt-1 font-medium ${HEALTH_CONFIG[tooltip.health].color}`}>
            {HEALTH_CONFIG[tooltip.health].label} · {tooltip.depPct.toFixed(0)}% depreciado
          </p>
          <p className="text-zinc-500 mt-0.5">{tooltip.asset.usefulLifeYears} anos de vida útil</p>
        </div>
      )}
    </div>
  )
}
