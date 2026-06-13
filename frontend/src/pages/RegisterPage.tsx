import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Home } from 'lucide-react'
import { isAxiosError } from 'axios'
import { useAuth } from '../auth/AuthContext.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { buttonClass, inputClass, labelClass } from '../components/ui.ts'

const fieldClass = 'flex min-w-0 flex-col gap-1.5'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', surname: '', username: '', email: '', password: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (form.password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Registration failed — check your details')
      } else if (isAxiosError(err) && err.response?.status === 429) {
        setError('Too many registration attempts. Please wait a few minutes and try again.')
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
        <h1 className="text-[26px] font-bold leading-tight">Create your account</h1>
        <p className="mb-6 mt-1 text-[15px] text-muted">Start organizing your home in minutes</p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-3 text-sm text-danger" role="alert">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-success-soft px-3.5 py-3 text-sm text-success" role="status">
            <CheckCircle2 size={18} className="shrink-0" />
            Account created! Check your email for the confirmation link, then sign in.
          </div>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className={fieldClass}>
              <label htmlFor="name" className={labelClass}>First name</label>
              <input id="name" autoComplete="given-name" required className={inputClass} value={form.name} onChange={set('name')} />
            </div>
            <div className={fieldClass}>
              <label htmlFor="surname" className={labelClass}>Last name</label>
              <input id="surname" autoComplete="family-name" required className={inputClass} value={form.surname} onChange={set('surname')} />
            </div>
          </div>
          <div className={fieldClass}>
            <label htmlFor="username" className={labelClass}>Username</label>
            <input id="username" autoComplete="username" required className={inputClass} value={form.username} onChange={set('username')} />
          </div>
          <div className={fieldClass}>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input id="email" type="email" autoComplete="email" required className={inputClass} value={form.email} onChange={set('email')} />
          </div>
          <div className={fieldClass}>
            <label htmlFor="password" className={labelClass}>Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              className={inputClass}
              value={form.password}
              onChange={set('password')}
            />
          </div>
          <div className={fieldClass}>
            <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className={buttonClass} type="submit" disabled={loading || success}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
