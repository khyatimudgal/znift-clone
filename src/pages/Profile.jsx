import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Camera, User, Moon, Sun, Globe, Calendar, Trash2, AlertTriangle, Trash,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import Toast from '../components/Toast'
import { API } from '../lib/api'

function Kbd({ children }) {
  return (
    <span className="inline-flex items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-[#a3a5ab]">
      {children}
    </span>
  )
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors ${checked ? 'bg-[#492ed9]' : 'bg-white/10'}`}
    >
      <span className={`size-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {hint && <div className="text-xs text-[#a3a5ab] mt-0.5">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-[#282b42] bg-[#101529] p-6 sm:p-8">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[#979cb7]">{subtitle}</p>}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [toast, setToast] = useState({ open: false, message: '' })
  const [confirmDelete, setConfirmDelete] = useState(false)

  // local-only preference state
  const [theme, setTheme] = useState('dark')
  const [notifications, setNotifications] = useState(false)
  const [standupTime, setStandupTime] = useState('')
  const [timezone, setTimezone] = useState('Calcutta')
  const [reminderTime, setReminderTime] = useState('10')
  const [pushNotif, setPushNotif] = useState(true)
  const [emailReminders, setEmailReminders] = useState(false)

  useEffect(() => {
    fetch(`${API}/user/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (u) { setUser(u); setName(u.username || '') } })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function onKey(e) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); navigate('/dashboard') }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  async function deleteAccount() {
    const res = await fetch(`${API}/auth/account`, { method: 'DELETE', credentials: 'include' })
    if (res.ok) {
      navigate('/login')
    } else {
      const data = await res.json().catch(() => ({}))
      setToast({ open: true, message: data.message || 'Failed to delete account' })
      setConfirmDelete(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#090b1c] text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/dashboard" className="inline-flex items-center gap-3 text-[15px] font-medium text-[#f9f9f9] hover:text-[#a3a5ab] transition-colors">
          <ArrowLeft className="size-4" /> Back to Dashboard
          <span className="flex items-center gap-1"><Kbd>⌘</Kbd><span className="text-[#a3a5ab] text-xs">+</span><Kbd>D</Kbd></span>
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-white">Profile</h1>
        <p className="mt-2 text-[#979cb7]">Manage your account settings and preferences</p>

        <div className="mt-10 space-y-6">
          <Card title="Profile Information" subtitle="Update your profile details and photo">
            <div className="flex items-center gap-5">
              <span className="flex size-20 items-center justify-center rounded-full bg-white/5">
                <User className="size-10 text-[#a3a5ab]" />
              </span>
              <div>
                <button className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors">
                  <Camera className="size-4" /> Upload Photo
                </button>
                <p className="mt-2 text-xs text-[#a3a5ab]">JPEG, PNG, or WebP. Max 5MB.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-white">Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg bg-[#1b1c34] border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#492ed9]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
                <input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="rounded-lg bg-[#1b1c34] border border-white/10 px-3 py-2 text-sm text-[#a3a5ab] outline-none cursor-not-allowed"
                />
                <span className="text-xs text-[#a3a5ab]">Email cannot be changed</span>
              </div>
            </div>
          </Card>

          <Card title="Preferences" subtitle="Customize your experience">
            <Field label="Theme" hint="Select your preferred color theme">
              <button className="flex items-center gap-2 rounded-md border border-white/10 bg-[#12162a] px-4 py-2 text-sm text-white">
                {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
                {theme === 'dark' ? 'Dark' : 'Light'}
                <svg width="10" height="10" viewBox="0 0 10 10" className="text-[#a3a5ab]"><path d="M2 4l3 3 3-3" stroke="currentColor" fill="none" strokeWidth="1.5"/></svg>
              </button>
            </Field>

            <Field label="Notifications" hint="Receive notifications about updates">
              <Toggle checked={notifications} onChange={setNotifications} />
            </Field>

            <Field label="Standup Reminder" hint="Show a reminder on the dashboard at this time">
              <input
                type="time"
                value={standupTime}
                onChange={(e) => setStandupTime(e.target.value)}
                className="rounded-md bg-[#12162a] border border-white/10 px-3 py-2 text-sm text-white outline-none"
              />
            </Field>

            <Field label="Timezone" hint="Your timezone for date calculations">
              <div className="flex items-center gap-2 rounded-md border border-white/10 bg-[#12162a] px-3 py-2 text-sm text-white">
                <Globe className="size-4 text-[#a3a5ab]" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="bg-transparent outline-none"
                >
                  <option>Calcutta</option>
                  <option>UTC</option>
                  <option>London</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Tokyo</option>
                </select>
              </div>
            </Field>

            <Field label="Reminder Time" hint="How early to be reminded before a task is due">
              <select
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="rounded-md border border-white/10 bg-[#12162a] px-3 py-2 text-sm text-white outline-none"
              >
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </Field>

            <Field label="Push Notifications" hint="Get browser notifications for upcoming tasks">
              <Toggle checked={pushNotif} onChange={setPushNotif} />
            </Field>

            <Field label="Email Reminders" hint="Receive email reminders for upcoming tasks">
              <Toggle checked={emailReminders} onChange={setEmailReminders} />
            </Field>
          </Card>

          <Card title="Integrations" subtitle="Connect external services to sync your tasks">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-white/5">
                  <Calendar className="size-5 text-[#a3a5ab]" />
                </span>
                <div>
                  <div className="text-sm font-medium text-white">Google Calendar</div>
                  <div className="text-xs text-[#a3a5ab]">Sync tasks with due times to your calendar</div>
                </div>
              </div>
              <button className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors">
                Connect
              </button>
            </div>
          </Card>

          <section className="rounded-2xl border border-[#992a32] bg-[#101529] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#f2543c]">
              <Trash2 className="size-5" /> Delete Account
            </h2>
            <p className="mt-2 text-sm text-[#979cb7]">
              Permanently delete your account and all associated data. This action cannot be undone after the grace period.
            </p>
            <button
              onClick={() => setConfirmDelete(true)}
              className="mt-4 flex items-center gap-2 rounded-md bg-[#992a32] hover:bg-[#852429] px-4 py-2 text-sm text-white transition-colors"
            >
              <Trash2 className="size-4 text-white" /> Delete Account
            </button>
          </section>
        </div>
      </main>

      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: '' })}
      />

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1e32] shadow-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f2543c]/15">
                <AlertTriangle className="size-5 text-[#f2543c]" />
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">Delete your account?</h2>
                <p className="mt-1 text-sm text-[#979cb7]">
                  This will permanently delete your account, all tasks, and all data. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="flex items-center gap-2 rounded-md bg-[#f2543c] hover:bg-[#d8462f] px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                <Trash className="size-4" /> Delete account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
