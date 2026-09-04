export function linearValue(purchasePrice, residualPct, usefulLifeYears, yearsElapsed) {
  const residualValue = purchasePrice * residualPct
  const depreciableAmount = purchasePrice - residualValue
  const annualDep = depreciableAmount / usefulLifeYears
  const totalDep = Math.min(annualDep * yearsElapsed, depreciableAmount)
  return Math.max(purchasePrice - totalDep, residualValue)
}

export function decliningValue(purchasePrice, residualPct, usefulLifeYears, yearsElapsed) {
  const residualValue = purchasePrice * residualPct
  const rate = 2 / usefulLifeYears
  let value = purchasePrice
  const steps = Math.floor(yearsElapsed)
  const fraction = yearsElapsed - steps
  for (let i = 0; i < steps; i++) {
    value = Math.max(value * (1 - rate), residualValue)
  }
  if (fraction > 0) {
    const nextValue = Math.max(value * (1 - rate), residualValue)
    value = value + (nextValue - value) * fraction
  }
  return Math.max(value, residualValue)
}

export function getCurrentValue(asset, date = new Date()) {
  const purchaseDate = new Date(asset.purchaseDate)
  const yearsElapsed = Math.max(0, (date - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25))
  if (asset.depreciationMethod === 'declining') {
    return decliningValue(asset.purchasePrice, asset.residualPct, asset.usefulLifeYears, yearsElapsed)
  }
  return linearValue(asset.purchasePrice, asset.residualPct, asset.usefulLifeYears, yearsElapsed)
}

export function getDepreciationPercent(asset) {
  const currentValue = getCurrentValue(asset)
  return ((asset.purchasePrice - currentValue) / asset.purchasePrice) * 100
}

export function getHealthStatus(depreciationPct) {
  if (depreciationPct < 30) return 'good'
  if (depreciationPct < 60) return 'warning'
  if (depreciationPct < 85) return 'critical'
  return 'end_of_life'
}

export const HEALTH_CONFIG = {
  good: { label: 'Bom', color: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500' },
  warning: { label: 'Atenção', color: 'text-yellow-400', bg: 'bg-yellow-500', border: 'border-yellow-500' },
  critical: { label: 'Crítico', color: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500' },
  end_of_life: { label: 'Fim de Vida', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500' },
}

export function getEndOfLifeDate(asset) {
  const purchaseDate = new Date(asset.purchaseDate)
  const endDate = new Date(purchaseDate)
  endDate.setFullYear(endDate.getFullYear() + asset.usefulLifeYears)
  return endDate
}

export function getYearsRemaining(asset) {
  const endDate = getEndOfLifeDate(asset)
  const now = new Date()
  return Math.max(0, (endDate - now) / (1000 * 60 * 60 * 24 * 365.25))
}

export function getDepreciationTimeline(asset, numPoints = 30) {
  const purchaseDate = new Date(asset.purchaseDate)
  const totalMonths = asset.usefulLifeYears * 12
  const step = Math.max(1, Math.ceil(totalMonths / numPoints))
  const result = []
  for (let m = 0; m <= totalMonths; m += step) {
    const date = new Date(purchaseDate)
    date.setMonth(date.getMonth() + m)
    const yearsElapsed = m / 12
    let value
    if (asset.depreciationMethod === 'declining') {
      value = decliningValue(asset.purchasePrice, asset.residualPct, asset.usefulLifeYears, yearsElapsed)
    } else {
      value = linearValue(asset.purchasePrice, asset.residualPct, asset.usefulLifeYears, yearsElapsed)
    }
    result.push({
      date: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      value: Math.round(value),
      month: m,
    })
  }
  return result
}

export function getInstallmentStatus(asset) {
  if (!asset.installments) return null
  const { total, monthlyValue, startDate } = asset.installments
  const start = new Date(startDate + 'T12:00:00')
  const now = new Date()
  const monthsElapsed = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  const paid = Math.min(total, Math.max(0, monthsElapsed))
  return {
    total,
    paid,
    remaining: total - paid,
    totalAmount: total * monthlyValue,
    paidAmount: paid * monthlyValue,
    remainingAmount: (total - paid) * monthlyValue,
    isComplete: paid >= total,
  }
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR')
}
