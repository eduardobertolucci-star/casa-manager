import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import AssetForm from './pages/AssetForm'
import AssetDetail from './pages/AssetDetail'
import Timeline from './pages/Timeline'
import Payments from './pages/Payments'
import { AssetsProvider } from './context/AssetsContext'

export default function App() {
  return (
    <AssetsProvider>
      <BrowserRouter>
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
      </BrowserRouter>
    </AssetsProvider>
  )
}
