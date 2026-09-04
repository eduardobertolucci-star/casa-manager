import { useState, useEffect } from 'react'

const STORAGE_KEY = 'casa_manager_assets'

export function useAssets() {
  const [assets, setAssets] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets))
  }, [assets])

  const addAsset = (asset) => {
    const newAsset = { ...asset, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    setAssets(prev => [...prev, newAsset])
    return newAsset
  }

  const updateAsset = (id, updates) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }

  const deleteAsset = (id) => {
    setAssets(prev => prev.filter(a => a.id !== id))
  }

  const getAsset = (id) => assets.find(a => a.id === id)

  const payInstallment = (id) => {
    setAssets(prev => prev.map(a => {
      if (a.id !== id || !a.installments) return a
      return { ...a, installments: { ...a.installments, paid: Math.min(a.installments.paid + 1, a.installments.total) } }
    }))
  }

  return { assets, addAsset, updateAsset, deleteAsset, getAsset, payInstallment }
}
