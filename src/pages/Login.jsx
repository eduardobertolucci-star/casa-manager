import { Home } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center">
            <Home size={32} className="text-indigo-200" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Casa Manager</h1>
            <p className="text-zinc-400 text-sm mt-1">Gestão inteligente dos seus ativos</p>
          </div>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 space-y-4">
          <p className="text-zinc-300 text-sm">
            Entre com sua conta Google para acessar seus ativos de qualquer dispositivo.
          </p>
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
            </svg>
            Entrar com Google
          </button>
        </div>

        <p className="text-zinc-600 text-xs">
          Seus dados ficam salvos na nuvem e sincronizados em todos os dispositivos.
        </p>
      </div>
    </div>
  )
}
