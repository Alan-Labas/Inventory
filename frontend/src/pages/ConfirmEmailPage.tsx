import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Loader2,} from 'lucide-react'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { cardClass } from '../components/ui.ts'
import { confirmEmail } from '../services/authService.ts'

type Status = 'loading' | 'ok' | 'error'

export function ConfirmEmailPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState<Status>('loading')
  // The confirmation token is single-use, so guard against StrictMode's
  // double effect run in dev (which would consume it twice).
  const requested = useRef(false)

  // Runs once when the page opens (the user just clicked the email link).
  useEffect(() => {
    if (requested.current) return
    requested.current = true

    if (!token) {
      setStatus('error')
      return
    }
    confirmEmail(token)
      .then(() => setStatus('ok'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <div className={`${cardClass} w-full max-w-md text-center`}>
        {status === 'loading' && (
          <>
            <Loader2 size={32} className="mx-auto mb-3 animate-spin text-primary" />
            <h1 className="text-xl font-bold">Confirming your email…</h1>
          </>
        )}

        {status === 'ok' && (
          <>
            <CheckCircle2 size={32} className="mx-auto mb-3 text-success" />
            <h1 className="text-xl font-bold">Email confirmed</h1>
            <p className="mt-2 text-sm text-muted">Your email is confirmed — you can now sign in.</p>
            <Link
              to="/login"
              className="mt-4 inline-block text-primary hover:text-primary-hover hover:underline"
            >
              Go to sign in
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle size={32} className="mx-auto mb-3 text-danger" />
            <h1 className="text-xl font-bold">Confirmation failed</h1>
            <p className="mt-2 text-sm text-muted">
              This confirmation link is invalid or has already been used.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-block text-primary hover:text-primary-hover hover:underline"
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
