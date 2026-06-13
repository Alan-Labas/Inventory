import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'
import { isAxiosError } from 'axios'
import { useAuth } from '../auth/AuthContext.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { buttonClass, inputClass, labelClass } from '../components/ui.ts'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ identifier, password })
      navigate(from, { replace: true })
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Invalid email or password')
      }else if (isAxiosError(err) && err.response?.status === 429) {
        setError('Too many login attempts. Please wait a few minutes and try again.')
      } else {
        setError('Could not reach the server. Is the backend running?')
      }

    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-card">
        <div className="mb-2 flex items-center gap-2.5 text-lg font-bold text-primary">
          <Home size={22} />
          Family Inventory
        </div>
        <h1 className="text-[26px] font-bold leading-tight">Welcome back</h1>
        <p className="mb-6 mt-1 text-[15px] text-muted">Sign in to manage your household</p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-3 text-sm text-danger" role="alert">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="identifier" className={labelClass}>Email or username</label>
            <input
              id="identifier"
              type="text"
              autoComplete="username"
              required
              className={inputClass}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="password" className={labelClass}>Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className={buttonClass} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          No account yet?{' '}
          <Link to="/register" className="text-primary hover:text-primary-hover hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
