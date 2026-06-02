import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Plus, Calendar, ChevronLeft, ChevronRight, ClipboardList,
  Clock, Flag, Check, Archive, Pencil, X, GripVertical, ArrowUp, ArrowDown,
} from 'lucide-react'
import AppHeader from '../components/AppHeader'
import Toast from '../components/Toast'
import { API } from '../lib/api'

function sameDay(a, b) {
  const x = new Date(a), y = new Date(b)
  return x.getDate() === y.getDate() && x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear()
}

function formatLong(d) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function toDateInputValue(d) {
  const x = new Date(d)
  const tz = x.getTimezoneOffset() * 60000
  return new Date(x - tz).toISOString().slice(0, 10)
}

function toTimeInputValue(d) {
  const x = new Date(d)
  return `${String(x.getHours()).padStart(2, '0')}:${String(x.getMinutes()).padStart(2, '0')}`
}

const priorityStyles = {
  high: 'border-[oklch(0.51_0.21_28.41)] text-[oklch(0.7_0.19_21.94)] bg-[#f2543c]/10',
  medium: 'border-[oklch(0.55_0.13_62.52)] text-[oklch(0.86_0.17_89.24)] bg-[#e0a93b]/10',
  low: 'border-[oklch(0.53_0.15_148.98)] text-[oklch(0.79_0.21_151.67)] bg-[#34d399]/10',
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

function Picker({ open, onClose, children }) {
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-full left-0 z-30 mt-2 rounded-lg border border-white/10 bg-[#13142c] shadow-2xl p-2 min-w-max"
      >
        {children}
      </div>
    </>
  )
}

function TaskRow({ task, onToggle, onArchive, onUpdate }) {
  const [hover, setHover] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const [openMenu, setOpenMenu] = useState(null)
  const done = task.completed

  useEffect(() => { setDraft(task.title) }, [task.title])

  function saveTitle() {
    setEditing(false)
    if (draft.trim() && draft !== task.title) onUpdate(task, { title: draft.trim() })
    else setDraft(task.title)
  }

  function setDueTime(timeStr) {
    if (!timeStr) return
    const base = task.dueDate ? new Date(task.dueDate) : new Date()
    const [h, m] = timeStr.split(':').map(Number)
    base.setHours(h, m, 0, 0)
    onUpdate(task, { dueDate: base.toISOString() })
    setOpenMenu(null)
  }

  function setDueDate(dateStr) {
    if (!dateStr) return
    const [y, m, d] = dateStr.split('-').map(Number)
    const base = task.dueDate ? new Date(task.dueDate) : new Date()
    base.setFullYear(y, m - 1, d)
    onUpdate(task, { dueDate: base.toISOString() })
    setOpenMenu(null)
  }

  function setPriority(p) {
    onUpdate(task, { priority: p })
    setOpenMenu(null)
  }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`group relative flex items-center gap-3 rounded-lg px-4 py-5 transition-colors ${
        done ? 'bg-[#07161b]' : 'bg-[#1b1317]'
      }`}
    >
      <span className={`shrink-0 ${hover && !done ? 'opacity-50' : 'opacity-0'} transition-opacity text-[#6b6e85]`}>
        <GripVertical className="size-4" />
      </span>

      <button
        type="button"
        onClick={() => onToggle(task)}
        className="flex size-6 items-center justify-center shrink-0"
        aria-label="toggle complete"
      >
        {done ? (
          <span className="flex size-5 items-center justify-center rounded bg-[#432cd7] text-white">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        ) : (
          <span className="flex size-5 items-center justify-center rounded border-2 border-white/20 hover:border-[#432cd7] transition-colors" />
        )}
      </button>

      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveTitle}
          onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') { setDraft(task.title); setEditing(false) } }}
          className="flex-1 bg-transparent text-sm text-white outline-none border-b border-white/20"
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          className={`flex-1 text-sm ${done ? 'text-[#a3a5ab]' : 'text-white'}`}
        >
          {task.title}
        </span>
      )}

      <div className="flex items-center gap-2 text-xs text-[#6b6e85]">
          <div className="relative w-[100px]">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'time' ? null : 'time') }}
              className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 hover:bg-white/5 ${task.dueDate ? 'text-[#432cd7]' : ''}`}
            >
              <Clock className="size-3.5 shrink-0" />
              {task.dueDate ? formatTime(new Date(task.dueDate)) : 'Set time'}
            </button>
            <Picker open={openMenu === 'time'} onClose={() => setOpenMenu(null)}>
              <input
                type="time"
                defaultValue={task.dueDate ? toTimeInputValue(task.dueDate) : ''}
                onChange={(e) => setDueTime(e.target.value)}
                className="rounded bg-[#1b1c34] text-white px-3 py-1.5 text-sm outline-none border border-white/10"
              />
            </Picker>
          </div>

          <div className="relative w-[100px]">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'date' ? null : 'date') }}
              className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 hover:bg-white/5"
            >
              <Calendar className="size-3.5 shrink-0" />
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Set due'}
            </button>
            <Picker open={openMenu === 'date'} onClose={() => setOpenMenu(null)}>
              <input
                type="date"
                defaultValue={task.dueDate ? toDateInputValue(task.dueDate) : ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded bg-[#1b1c34] text-white px-3 py-1.5 text-sm outline-none border border-white/10"
              />
            </Picker>
          </div>

          <div className="relative w-[95px]">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === 'priority' ? null : 'priority') }}
              className={`flex w-full items-center justify-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${task.priority && priorityStyles[task.priority] ? priorityStyles[task.priority] : 'border-transparent'}`}
            >
              <Flag className="size-3 shrink-0" />
              {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Set priority'}
            </button>
            <Picker open={openMenu === 'priority'} onClose={() => setOpenMenu(null)}>
              <div className="flex flex-col min-w-32">
                {['high', 'medium', 'low'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-white hover:bg-white/5 text-left"
                  >
                    <span className={`size-2 rounded-full ${p === 'high' ? 'bg-[#f2543c]' : p === 'medium' ? 'bg-[#e0a93b]' : 'bg-[#34d399]'}`} />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </Picker>
          </div>
        </div>

      <div className={`flex items-center gap-1 ${hover ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex size-7 items-center justify-center rounded text-[#a3a5ab] hover:bg-white/5 hover:text-white"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onArchive(task)}
          title="Archive"
          className="flex size-7 items-center justify-center rounded text-[#a3a5ab] hover:bg-white/5 hover:text-white"
        >
          <Archive className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function Tasks() {
  const [date, setDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '', undoId: null })
  const [sortBy, setSortBy] = useState('priority')
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => { loadTasks() }, [])

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

  async function submitLog(title) {
    await fetch(`${API}/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed: true, dueDate: new Date().toISOString() }),
    })
    loadTasks()
  }

  function loadTasks() {
    fetch(`${API}/tasks`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setTasks)
      .catch(() => setTasks([]))
  }

  async function addTask(title) {
    await fetch(`${API}/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dueDate: date.toISOString() }),
    })
    loadTasks()
  }

  async function toggleTask(task) {
    await fetch(`${API}/tasks/${task._id}/toggle`, { method: 'PATCH', credentials: 'include' })
    loadTasks()
  }

  async function updateTask(task, patch) {
    const res = await fetch(`${API}/tasks/${task._id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      console.error('Update failed:', res.status, data)
    }
    loadTasks()
  }

  async function archiveTask(task) {
    await fetch(`${API}/tasks/${task._id}/archive`, { method: 'PATCH', credentials: 'include' })
    setToast({ open: true, message: 'Task archived', undoId: task._id })
    loadTasks()
  }

  async function undoArchive() {
    if (!toast.undoId) return
    await fetch(`${API}/tasks/${toast.undoId}/restore`, { method: 'PATCH', credentials: 'include' })
    loadTasks()
  }

  function shiftDate(days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    setDate(d)
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const dayTasks = tasks
    .filter(t => sameDay(t.dueDate, date))
    .slice()
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
      }
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      return 0
    })

  return (
    <div className="min-h-screen bg-[#090b1c] text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[15px] font-medium text-[#f9f9f9] hover:text-[#a3a5ab] transition-colors">
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>

        <div className="mt-4 flex items-start justify-between">
          <h1 className="text-4xl font-bold text-white">Today's Tasks</h1>
          <Link to="/summary" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors">
            <ClipboardList className="size-4" /> Summary
          </Link>
        </div>

        <div className="mt-6 flex items-center gap-3 relative">
          <button onClick={() => shiftDate(-1)} className="text-white hover:text-[#a3a5ab] transition-colors">
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowDatePicker(s => !s)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors"
          >
            <Calendar className="size-4 text-[#a3a5ab]" />
            {formatLong(date)}
          </button>
          {showDatePicker && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowDatePicker(false)} />
              <input
                type="date"
                value={toDateInputValue(date)}
                onChange={(e) => { const [y,m,d] = e.target.value.split('-').map(Number); setDate(new Date(y, m-1, d)); setShowDatePicker(false) }}
                className="absolute top-full left-12 mt-2 z-30 rounded bg-[#1b1c34] text-white px-3 py-1.5 text-sm outline-none border border-white/10"
              />
            </>
          )}
          <button onClick={() => shiftDate(1)} className="text-[#a3a5ab] hover:text-white transition-colors">
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors"
          >
            <Plus className="size-4" /> Add Task
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen(o => !o)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                sortBy
                  ? 'bg-[#595eae] text-white hover:bg-[#4d529c]'
                  : 'border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]'
              }`}
            >
              <Flag className="size-4" /> {sortBy === 'priority' ? 'Priority' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'newest' ? 'Newest' : 'Sort'}
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-30 w-56 rounded-lg border border-white/10 bg-[#13142c] shadow-2xl overflow-hidden p-1">
                  <button
                    onClick={() => { setSortBy('priority'); setSortOpen(false) }}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-white hover:bg-white/5"
                  >
                    <Check className={`size-4 ${sortBy === 'priority' ? 'opacity-100' : 'opacity-0'}`} />
                    <Flag className="size-4 text-[#a3a5ab]" />
                    Priority (High to Low)
                  </button>
                  <button
                    onClick={() => { setSortBy('oldest'); setSortOpen(false) }}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-white hover:bg-white/5"
                  >
                    <Check className={`size-4 ${sortBy === 'oldest' ? 'opacity-100' : 'opacity-0'}`} />
                    <ArrowUp className="size-4 text-[#a3a5ab]" />
                    Oldest First
                  </button>
                  <button
                    onClick={() => { setSortBy('newest'); setSortOpen(false) }}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-white hover:bg-white/5"
                  >
                    <Check className={`size-4 ${sortBy === 'newest' ? 'opacity-100' : 'opacity-0'}`} />
                    <ArrowDown className="size-4 text-[#a3a5ab]" />
                    Newest First
                  </button>
                  <div className="my-1 border-t border-white/8" />
                  <button
                    onClick={() => { setSortBy(null); setSortOpen(false) }}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-white hover:bg-white/5"
                  >
                    <X className="size-4 text-[#a3a5ab]" />
                    <span className="ml-6">Clear sort</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {dayTasks.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-[#a3a5ab]">No tasks for today.</p>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-[#492ed9] hover:bg-[#3e29c4] px-4 py-2 text-sm text-white transition-colors"
            >
              <Plus className="size-4" /> Add your first task
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-2">
            {dayTasks.map(t => (
              <TaskRow
                key={t._id}
                task={t}
                onToggle={toggleTask}
                onArchive={archiveTask}
                onUpdate={updateTask}
              />
            ))}
          </div>
        )}

        <div className="mt-16 border-t border-white/8 pt-6">
          <Link to="/archive" className="inline-flex items-center gap-2 text-sm text-[#989cb8] hover:text-white transition-colors">
            <Archive className="size-4" /> View Archive
          </Link>
        </div>
      </main>

      <QuickModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={addTask}
        placeholder="What needs to be done..."
      />
      <QuickModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onSubmit={submitLog}
        placeholder="What did you accomplish..."
      />

      <Toast
        open={toast.open}
        message={toast.message}
        onUndo={toast.undoId ? undoArchive : null}
        onClose={() => setToast({ open: false, message: '', undoId: null })}
      />
    </div>
  )
}
