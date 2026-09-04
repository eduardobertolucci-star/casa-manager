import { getHealthStatus, HEALTH_CONFIG } from '../utils/depreciation'

export default function HealthBadge({ depreciationPct }) {
  const status = getHealthStatus(depreciationPct)
  const cfg = HEALTH_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-700 ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.bg}`} />
      {cfg.label}
    </span>
  )
}
