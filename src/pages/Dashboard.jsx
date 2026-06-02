import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Check, ChevronDown, Plus, X, Flame } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import { API } from '../lib/api'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function isToday(date) {
  const d = new Date(date)
  const t = new Date()
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear()
}

function isOverdue(date) {
  return new Date(date) < new Date() && !isToday(date)
}

const priorityStyles = {
  high: 'border-[oklch(0.51_0.21_28.41)] text-[oklch(0.7_0.19_21.94)] bg-[#f2543c]/10',
  medium: 'border-[oklch(0.55_0.13_62.52)] text-[oklch(0.86_0.17_89.24)] bg-[#e0a93b]/10',
  low: 'border-[oklch(0.53_0.15_148.98)] text-[oklch(0.79_0.21_151.67)] bg-[#34d399]/10',
}

function TaskRow({ task, onToggle, variant = 'default' }) {
  const overdue = variant === 'overdue'
  return (
    <div className={`flex items-center gap-3 rounded-lg px-4 py-5 transition-colors ${
      task.completed ? 'bg-[#07161b]' : 'bg-[#1b1317]'
    }`}>
      <button
        type="button"
        onClick={() => onToggle(task)}
        className="flex size-6 items-center justify-center shrink-0"
        aria-label="toggle complete"
      >
        {task.completed ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-[#34d399] text-white">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        ) : (
          <span className={`flex size-5 items-center justify-center rounded-full border-2 transition-colors ${overdue ? 'border-[#f2543c]' : 'border-[#e0a93b]'}`} />
        )}
      </button>
      <span className={`flex-1 text-sm ${task.completed ? 'text-[#6b6e85] line-through' : 'text-white'}`}>
        {task.title}
      </span>
      <span className={`flex w-20 shrink-0 items-center justify-end gap-1.5 text-xs ${overdue ? 'text-[#f2543c]' : 'text-[#432cd7]'}`}>
        {task.dueDate && !task.completed && (
          <>
            <Clock className="size-3.5" />
            {formatTime(new Date(task.dueDate))}
          </>
        )}
      </span>
      <span className="flex w-20 shrink-0 justify-center">
        {task.priority && task.priority !== 'low' && !task.completed && (
          <span className={`rounded-full border px-2 py-0.5 text-xs ${priorityStyles[task.priority] || ''}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        )}
      </span>
    </div>
  )
}

function QuickModal({ open, onClose, onSubmit, placeholder }) {
  const [title, setTitle] = useState('')

  if (!open) return null

  async function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    await onSubmit(title.trim())
    setTitle('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6 pt-32" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-white/10 bg-[#13142c] shadow-2xl"
      >
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
          placeholder={placeholder}
          className="w-full bg-transparent px-5 py-4 text-base text-white placeholder-[#6b6e85] outline-none"
        />
        <div className="flex items-center justify-between border-t border-white/8 px-5 py-3">
          <span className="text-xs text-[#a3a5ab]">Today</span>
          <button onClick={onClose} type="button" className="text-[#a3a5ab] hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [streak, setStreak] = useState(0)
  const [showCompleted, setShowCompleted] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [, setTick] = useState(0)

  useEffect(() => {
    function onKey(e) {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const k = e.key.toLowerCase()
      if (k === 'k') { e.preventDefault(); setAddOpen(true); setLogOpen(false) }
      else if (k === 'l') { e.preventDefault(); setLogOpen(true); setAddOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    fetch(`${API}/user/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(setUser)
      .catch(() => {})
    loadTasks()
    loadStreak()
    const id = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(id)
  }, [])

  function loadTasks() {
    fetch(`${API}/tasks`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setTasks)
      .catch(() => setTasks([]))
  }

  function loadStreak() {
    fetch(`${API}/user/streak`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : { streak: 0 })
      .then(d => setStreak(d.streak || 0))
      .catch(() => {})
  }

  async function toggleTask(task) {
    const res = await fetch(`${API}/tasks/${task._id}/toggle`, {
      method: 'PATCH',
      credentials: 'include',
    })
    if (res.ok) { loadTasks(); loadStreak() }
  }

  async function submitLog(title) {
    await fetch(`${API}/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed: true, dueDate: new Date().toISOString() }),
    })
    loadTasks()
    loadStreak()
  }

  async function submitTask(title) {
    await fetch(`${API}/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dueDate: new Date().toISOString() }),
    })
    loadTasks()
  }

  const overdue = tasks.filter(t => !t.completed && isOverdue(t.dueDate))
  const todayTasks = tasks.filter(t => !t.completed && isToday(t.dueDate))
  const completedToday = tasks.filter(t => t.completed && isToday(t.updatedAt || t.dueDate))
  const pending = overdue.length + todayTasks.length

  return (
    <div className="min-h-screen bg-[#090b1c] text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {greeting()}, {user?.username || 'user'}
            </h1>
            <p className="mt-1 text-sm text-[#a3a5ab]">{formatDate(new Date())}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-[#a3a5ab]">
              <span><span className="text-white font-medium">{pending}</span> pending</span>
              <span>·</span>
              <span><span className="text-white font-medium">{completedToday.length}</span> completed</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#ff8908]">
                <Flame className="size-4" />
                <span className="font-medium">{streak}</span>
              </span>
            </div>
          </div>
          <Link
            to="/tasks"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors"
          >
            View Tasks <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 space-y-8">
          {overdue.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-[#f2543c]">Overdue</h2>
              <div className="space-y-2">
                {overdue.map(t => <TaskRow key={t._id} task={t} onToggle={toggleTask} variant="overdue" />)}
              </div>
            </section>
          )}

          {todayTasks.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-[#e0a93b]">Today</h2>
              <div className="space-y-2">
                {todayTasks.map(t => <TaskRow key={t._id} task={t} onToggle={toggleTask} />)}
              </div>
            </section>
          )}

          {completedToday.length > 0 && (
            <section>
              <button
                onClick={() => setShowCompleted(s => !s)}
                className="mb-3 flex items-center gap-2 text-sm text-[#a3a5ab] hover:text-white transition-colors"
              >
                <ChevronDown className={`size-4 transition-transform ${showCompleted ? '' : '-rotate-90'}`} />
                <span><span className="text-white font-medium">{completedToday.length}</span> completed today</span>
              </button>
              {showCompleted && (
                <div className="space-y-2">
                  {completedToday.map(t => <TaskRow key={t._id} task={t} onToggle={toggleTask} />)}
                </div>
              )}
            </section>
          )}

          {pending === 0 && completedToday.length === 0 && (
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-12 text-center">
              <p className="text-[#a3a5ab]">No tasks yet.</p>
              <button
                onClick={() => setAddOpen(true)}
                className="mt-3 inline-flex items-center gap-2 text-sm text-[#492ed9] hover:underline"
              >
                Add your first task <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setLogOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-[#34d399] hover:bg-[#2ec48a] px-5 py-3 text-sm font-medium text-[#0a0b1e] shadow-lg transition-colors"
          title="Log a task you already finished but never added"
        >
          <Plus className="size-4" /> Log completed task
        </button>
      </main>

      <QuickModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onSubmit={submitLog}
        placeholder="What did you accomplish..."
      />
      <QuickModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={submitTask}
        placeholder="What needs to be done..."
      />
    </div>
  )
}
