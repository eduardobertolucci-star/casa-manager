import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AssetsProvider } from './context/AssetsContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import AssetForm from './pages/AssetForm'
import AssetDetail from './pages/AssetDetail'
import Timeline from './pages/Timeline'
import Payments from './pages/Payments'

function AppRoutes() {
  const { user } = useAuth()

  // Still loading auth state
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <AssetsProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assets/new" element={<AssetForm />} />
          <Route path="assets/:id" element={<AssetDetail />} />
          <Route path="assets/:id/edit" element={<AssetForm />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="payments" element={<Payments />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </AssetsProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
