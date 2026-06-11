import { Link } from 'react-router-dom'
import { Calendar, ListTodo, PackageOpen, PawPrint, StickyNote, Users } from 'lucide-react'
import { useAuth } from '../auth/AuthContext.tsx'
import { ThemeToggle } from '../components/ThemeToggle.tsx'
import { cardClass } from '../components/ui.ts'

// Cards with a `to` are clickable and navigate to their section.
const sections = [
  { icon: PackageOpen, title: 'Inventory', text: 'Track what is in your fridge, pantry and freezer.', to: '/items' },
  { icon: Users, title: 'Family', text: 'Invite members to your household with an invite code.', to: '/family' },
  { icon: Calendar, title: 'Calendar', text: 'Shared dates, expiry reminders and shopping days.', to: '/calendar' },
  { icon: ListTodo, title: 'Tasks', text: 'Reminders and to-dos for the whole household.', to: '/tasks' },
  { icon: StickyNote, title: 'Notes', text: 'Quick shared notes for everyone at home.', to: '/notes' },
  { icon: PawPrint, title: 'Pets', text: "Track pet food supply — never run out of Aik's food.", to: 'pets' },
]

export function DashboardPage() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-[15px] text-muted">
            {greeting}, {user?.name ?? 'there'}
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {sections.map(({ icon: Icon, title, text, to }) => {
          const content = (
            <>
              <span className="mb-3 inline-flex rounded-lg bg-primary-soft p-2.5 text-primary">
                <Icon size={22} />
              </span>
              <h2 className="mb-1.5 text-[17px] font-semibold">{title}</h2>
              <p className="text-sm text-muted">{text}</p>
            </>
          )
          return to ? (
            <Link
              key={title}
              to={to}
              className={`${cardClass} block cursor-pointer text-fg no-underline transition-colors duration-200 hover:border-primary hover:no-underline`}
            >
              {content}
            </Link>
          ) : (
            <div className={cardClass} key={title}>
              {content}
            </div>
          )
        })}
      </div>
    </>
  )
}
