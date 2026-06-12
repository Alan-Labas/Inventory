import {ThemeToggle} from "../components/ThemeToggle.tsx";
import { buttonClass, inputClass, labelClass } from '../components/ui.ts'
import {type FormEvent, useState} from "react";
import {isAxiosError} from "axios";
import {changePassword} from "../services/authService.ts";
import {AlertCircle, CheckCircle2} from "lucide-react";

const fieldClass = 'flex min-w-0 flex-col gap-1.5'

export function SettingsPage(){
    const [newPassword, setNewPassword] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
        await changePassword({oldPassword, newPassword});
      setSuccess(true)
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 400) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Registration failed — check your details')
      } else {
        setError('Could not reach the server. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }



    return(
        <>

            {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-3 text-sm text-danger" role="alert">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-success-soft px-3.5 py-3 text-sm text-success" role="status">
            <CheckCircle2 size={18} className="shrink-0" />
            Password changed.
          </div>
        )}

            <div className="mb-6 flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold">Settings</h1>
                <ThemeToggle />
            </div>

            <form onSubmit={onSubmit}>
                <div className={fieldClass}>
                    <label htmlFor="password" className={labelClass}>Old password</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="old-password"
                        required
                        className={inputClass}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div className={fieldClass}>
                    <label htmlFor="newPassword" className={labelClass}>New password</label>
                    <input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        className={inputClass}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className={fieldClass}>
                    <label htmlFor="confirmPassword" className={labelClass}>Confirm new password</label>
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
                <br/>
                <button className={buttonClass} type="submit" disabled={loading || success}>
                    {loading ? 'changeing password' : 'Change password'}
                </button>
            </form>
        </>
    )
}