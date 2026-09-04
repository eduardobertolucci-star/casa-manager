import { createContext, useContext } from 'react'
import { useAssets } from '../hooks/useAssets'

const AssetsContext = createContext(null)

export function AssetsProvider({ children }) {
  const value = useAssets()
  return <AssetsContext.Provider value={value}>{children}</AssetsContext.Provider>
}

export function useAssetsContext() {
  const ctx = useContext(AssetsContext)
  if (!ctx) throw new Error('useAssetsContext must be used within AssetsProvider')
  return ctx
}
