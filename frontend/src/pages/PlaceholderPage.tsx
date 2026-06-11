import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { cardClass } from '../components/ui.ts'

// Temporary stand-in for sections that are planned but not built yet.
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <ThemeToggle />
      </div>
      <div className={cardClass}>
        <h2 className="mb-1.5 text-[17px] font-semibold">Coming soon</h2>
        <p className="text-sm text-muted">This section is part of a later development phase.</p>
      </div>
    </>
  )
}
