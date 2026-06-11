import { useEffect, useState, type FormEvent } from 'react'
import { AlertCircle, Copy, Home, UserPlus, Users } from 'lucide-react'
import { isAxiosError } from 'axios'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { buttonClass, cardClass, inputClass, labelClass } from '../components/ui.ts'
import type { Household } from '../domain/household.ts'
import * as householdService from '../services/householdService.ts'

export function FamilyPage() {
  const [household, setHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newName, setNewName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    householdService
      .getMyHousehold()
      .then(setHousehold)
      .catch(() => setError('Could not load your household'))
      .finally(() => setLoading(false))
  }, [])

  const submitError = (err: unknown, fallback: string) =>
    setError(isAxiosError(err) && typeof err.response?.data === 'string' ? err.response.data : fallback)

  const onCreate = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      setHousehold(await householdService.createHousehold(newName))
    } catch (err) {
      submitError(err, 'Could not create the household')
    } finally {
      setSaving(false)
    }
  }

  const onJoin = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      setHousehold(await householdService.joinHousehold(inviteCode.trim()))
    } catch (err) {
      submitError(err, 'Could not join — check the invite code')
    } finally {
      setSaving(false)
    }
  }

  const copyInvite = async () => {
    if (!household?.inviteCode) return
    await navigator.clipboard.writeText(household.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Family</h1>
          <p className="mt-1 text-[15px] text-muted">Your household and its members</p>
        </div>
        <ThemeToggle />
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-danger-soft px-3.5 py-3 text-sm text-danger" role="alert">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : household ? (
        <div className={cardClass}>
          <span className="mb-3 inline-flex rounded-lg bg-primary-soft p-2.5 text-primary">
            <Home size={22} />
          </span>
          <h2 className="text-[17px] font-semibold">{household.name}</h2>
          <p className="mt-2 text-sm text-muted">
            Share this invite code so family members can join:
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="rounded-lg bg-primary-soft px-3 py-1.5 font-mono text-primary">
              {household.inviteCode}
            </code>
            <button
              type="button"
              onClick={copyInvite}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-muted transition-colors duration-200 hover:bg-surface-hover hover:text-fg"
            >
              <Copy size={15} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <form onSubmit={onCreate} className={cardClass}>
            <h2 className="mb-3 flex items-center gap-2 text-[17px] font-semibold">
              <Users size={18} className="text-primary" />
              Create a household
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label htmlFor="hh-name" className={labelClass}>Household name</label>
                <input id="hh-name" required className={inputClass} value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <button type="submit" className={buttonClass} disabled={saving}>
                {saving ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>

          <form onSubmit={onJoin} className={cardClass}>
            <h2 className="mb-3 flex items-center gap-2 text-[17px] font-semibold">
              <UserPlus size={18} className="text-primary" />
              Join with invite code
            </h2>
            <div className="flex flex-col gap-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label htmlFor="hh-code" className={labelClass}>Invite code</label>
                <input id="hh-code" required className={inputClass} value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
              </div>
              <button type="submit" className={buttonClass} disabled={saving}>
                {saving ? 'Joining…' : 'Join'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
