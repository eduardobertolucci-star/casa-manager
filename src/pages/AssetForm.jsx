import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'
import { useAssetsContext } from '../context/AssetsContext'
import { CATEGORIES, getSubcategoryDef } from '../data/categories'
import { formatCurrency } from '../utils/depreciation'

const today = new Date().toISOString().split('T')[0]

const emptyForm = {
  name: '',
  brand: '',
  categoryKey: '',
  subcategoryKey: '',
  purchaseDate: today,
  purchasePrice: '',
  notes: '',
  hasInstallments: false,
  installments: { total: 12, monthlyValue: '', startDate: today },
}

export default function AssetForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addAsset, updateAsset, getAsset } = useAssetsContext()
  const [form, setForm] = useState(emptyForm)
  const isEditing = !!id

  useEffect(() => {
    if (isEditing) {
      const asset = getAsset(id)
      if (asset) {
        setForm({
          name: asset.name,
          brand: asset.brand || '',
          categoryKey: asset.categoryKey,
          subcategoryKey: asset.subcategoryKey,
          purchaseDate: asset.purchaseDate,
          purchasePrice: String(asset.purchasePrice),
          notes: asset.notes || '',
          hasInstallments: !!asset.installments,
          installments: asset.installments
            ? {
                total: asset.installments.total,
                monthlyValue: String(asset.installments.monthlyValue),
                startDate: asset.installments.startDate,
              }
            : emptyForm.installments,
        })
      }
    }
  }, [id])

  const subDef =
    form.categoryKey && form.subcategoryKey
      ? getSubcategoryDef(form.categoryKey, form.subcategoryKey)
      : null

  const set = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value }
      // Sync installment start date with purchase date
      if (field === 'purchaseDate') {
        updated.installments = { ...prev.installments, startDate: value }
      }
      return updated
    })
  }
  const setInst = (field, value) =>
    setForm(prev => ({ ...prev, installments: { ...prev.installments, [field]: value } }))

  const handleCategoryChange = catKey => {
    setForm(prev => ({ ...prev, categoryKey: catKey, subcategoryKey: '' }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.categoryKey || !form.subcategoryKey) {
      alert('Selecione categoria e tipo.')
      return
    }
    const sub = getSubcategoryDef(form.categoryKey, form.subcategoryKey)
    const assetData = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      categoryKey: form.categoryKey,
      subcategoryKey: form.subcategoryKey,
      purchaseDate: form.purchaseDate,
      purchasePrice: parseFloat(form.purchasePrice),
      notes: form.notes.trim(),
      depreciationMethod: sub.method,
      usefulLifeYears: sub.usefulLife,
      residualPct: sub.residualPct,
      installments: form.hasInstallments
        ? {
            total: parseInt(form.installments.total),
            monthlyValue: parseFloat(form.installments.monthlyValue),
            startDate: form.installments.startDate,
          }
        : null,
    }
    if (isEditing) {
      updateAsset(id, assetData)
      navigate(`/assets/${id}`)
    } else {
      const newAsset = addAsset(assetData)
      navigate(`/assets/${newAsset.id}`)
    }
  }

  const inputCls =
    'w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500'
  const labelCls = 'block text-zinc-300 text-xs font-medium mb-1.5'

  return (
    <div className="p-6 max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to={isEditing ? `/assets/${id}` : '/assets'}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-white text-xl font-bold">
            {isEditing ? 'Editar Ativo' : 'Novo Ativo'}
          </h2>
          <p className="text-zinc-400 text-sm">Preencha as informações do item</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className={labelCls}>Nome do item *</label>
          <input
            type="text"
            required
            className={inputCls}
            placeholder="Ex: Geladeira Samsung"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </div>

        {/* Brand */}
        <div>
          <label className={labelCls}>Marca / Modelo</label>
          <input
            type="text"
            className={inputCls}
            placeholder="Ex: Samsung RF22"
            value={form.brand}
            onChange={e => set('brand', e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label className={labelCls}>Categoria *</label>
          <select
            required
            className={inputCls}
            value={form.categoryKey}
            onChange={e => handleCategoryChange(e.target.value)}
          >
            <option value="">Selecione a categoria</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {form.categoryKey && (
          <div>
            <label className={labelCls}>Tipo *</label>
            <select
              required
              className={inputCls}
              value={form.subcategoryKey}
              onChange={e => set('subcategoryKey', e.target.value)}
            >
              <option value="">Selecione o tipo</option>
              {Object.entries(CATEGORIES[form.categoryKey].subcategories).map(([key, sub]) => (
                <option key={key} value={key}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Depreciation info */}
        {subDef && (
          <div className="bg-zinc-800 border border-indigo-900 rounded-lg p-3 flex gap-2">
            <Info size={14} className="text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-zinc-300">
              <span className="text-indigo-400 font-semibold">Depreciação automática: </span>
              {subDef.method === 'declining' ? 'Acelerada (Double Declining Balance)' : 'Linear'} ·
              Vida útil: <strong>{subDef.usefulLife} anos</strong> ·
              Valor residual: <strong>{(subDef.residualPct * 100).toFixed(0)}%</strong>
            </p>
          </div>
        )}

        {/* Purchase date & price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Data de compra *</label>
            <input
              type="date"
              required
              className={inputCls}
              value={form.purchaseDate}
              onChange={e => set('purchaseDate', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Valor de compra (R$) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className={inputCls}
              placeholder="0,00"
              value={form.purchasePrice}
              onChange={e => set('purchasePrice', e.target.value)}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className={labelCls}>Observações</label>
          <textarea
            className={inputCls}
            rows={2}
            placeholder="Notas adicionais..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        {/* Installments */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasInstallments}
              onChange={e => set('hasInstallments', e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500"
            />
            <span className="text-white text-sm font-medium">Item parcelado</span>
          </label>

          {form.hasInstallments && (
            <div className="mt-4 space-y-3 pt-4 border-t border-zinc-700">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Total de parcelas</label>
                  <input
                    type="number"
                    min="1"
                    className={inputCls}
                    value={form.installments.total}
                    onChange={e => setInst('total', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Valor da parcela (R$)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={inputCls}
                    placeholder="0,00"
                    value={form.installments.monthlyValue}
                    onChange={e => setInst('monthlyValue', e.target.value)}
                  />
                </div>
              </div>
              {form.installments.monthlyValue && form.installments.total && (
                <p className="text-zinc-400 text-xs">
                  Total: {formatCurrency(parseFloat(form.installments.monthlyValue) * parseInt(form.installments.total))} ·
                  Restante: {formatCurrency(parseFloat(form.installments.monthlyValue) * (parseInt(form.installments.total) - parseInt(form.installments.paid || 0)))}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          {isEditing ? 'Salvar alterações' : 'Cadastrar ativo'}
        </button>
      </form>
    </div>
  )
}
