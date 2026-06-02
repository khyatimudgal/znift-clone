import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Calendar, ChevronLeft, ChevronRight, ClipboardList, Copy,
  CircleCheck, Circle, Clock,
} from 'lucide-react'
import Toast from '../components/Toast'
import { API } from '../lib/api'

function sameDay(a, b) {
  const x = new Date(a), y = new Date(b)
  return x.getDate() === y.getDate() && x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear()
}

function isToday(d) {
  return sameDay(d, new Date())
}

function isYesterday(d) {
  const y = new Date(); y.setDate(y.getDate() - 1)
  return sameDay(d, y)
}

function isTomorrow(d) {
  const t = new Date(); t.setDate(t.getDate() + 1)
  return sameDay(d, t)
}

function formatLabel(d) {
  const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (isToday(d)) return `Today (${monthDay})`
  if (isYesterday(d)) return `Yesterday (${monthDay})`
  if (isTomorrow(d)) return `Tomorrow (${monthDay})`
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
}

function toDateInputValue(d) {
  const x = new Date(d)
  const tz = x.getTimezoneOffset() * 60000
  return new Date(x - tz).toISOString().slice(0, 10)
}

function formatTime(d) {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function Summary() {
  const [date, setDate] = useState(new Date())
  const [tasks, setTasks] = useState([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [toast, setToast] = useState({ open: false, message: '' })

  useEffect(() => { load() }, [])

  function load() {
    fetch(`${API}/tasks`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setTasks)
      .catch(() => setTasks([]))
  }

  function shiftDate(days) {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    setDate(d)
  }

  const dayTasks = tasks.filter(t => sameDay(t.dueDate, date))
  const completed = dayTasks.filter(t => t.completed)
  const pending = dayTasks.filter(t => !t.completed)

  function copyMarkdown() {
    const lines = []
    lines.push(`# Summary — ${formatLabel(date)}`)
    lines.push('')
    lines.push(`${completed.length} completed, ${pending.length} pending`)
    lines.push('')

    if (completed.length > 0) {
      lines.push(`## Completed (${completed.length})`)
      completed.forEach(t => {
        const time = t.dueDate ? ` — ${formatTime(new Date(t.dueDate))}` : ''
        lines.push(`- [x] ${t.title}${time}`)
      })
      lines.push('')
    }

    if (pending.length > 0) {
      lines.push(`## Still Pending (${pending.length})`)
      pending.forEach(t => {
        const time = t.dueDate ? ` — ${formatTime(new Date(t.dueDate))}` : ''
        lines.push(`- [ ] ${t.title}${time}`)
      })
    }

    navigator.clipboard.writeText(lines.join('\n'))
    setToast({ open: true, message: 'Copied as Markdown' })
  }

  return (
    <div className="min-h-screen bg-[#090b1c] text-foreground">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Link to="/tasks" className="inline-flex items-center gap-2 text-[15px] font-medium text-[#f9f9f9] hover:text-[#a3a5ab] transition-colors">
          <ArrowLeft className="size-4" /> Back to Tasks
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-white">Summary</h1>

        <div className="mt-10 flex items-center gap-3 relative">
          <button onClick={() => shiftDate(-1)} className="text-white hover:text-[#a3a5ab] transition-colors">
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowDatePicker(s => !s)}
            className="flex items-center justify-start gap-2 rounded-lg border border-white/10 bg-[#12162a] min-w-[260px] px-5 py-2 text-sm text-white hover:bg-[#161a30] transition-colors"
          >
            <Calendar className="size-4 text-[#f9f9f9]" />
            {formatLabel(date)}
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
          <button onClick={() => shiftDate(1)} className="text-white hover:text-[#a3a5ab] transition-colors">
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-[#282b42] bg-[#101529] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <ClipboardList className="size-5 text-[#e6e5e8] mt-1" />
              <div>
                <h2 className="text-xl font-bold text-white">Summary</h2>
                <p className="mt-1 text-sm text-[#a3a5ab]">
                  {completed.length} completed, {pending.length} pending
                </p>
              </div>
            </div>
            <button
              onClick={copyMarkdown}
              disabled={dayTasks.length === 0}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Copy className="size-4" /> Copy as Markdown
            </button>
          </div>

          {dayTasks.length === 0 ? (
            <div className="mt-8 text-center text-[#a3a5ab]">No tasks for this day.</div>
          ) : (
            <div className="mt-8 space-y-6">
              {completed.length > 0 && (
                <section>
                  <div className="flex items-center gap-2">
                    <CircleCheck className="size-4 text-[#01c950]" />
                    <h3 className="text-sm font-semibold text-[#9196b1]">
                      Completed ({completed.length})
                    </h3>
                  </div>
                  <ul className="mt-2 ml-6 space-y-1.5">
                    {completed.map(t => (
                      <li key={t._id} className="flex items-center gap-3 text-base text-white">
                        <span>{t.title}</span>
                        {t.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-[#a3a5ab]">
                            <Clock className="size-3" />
                            {formatTime(new Date(t.dueDate))}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {pending.length > 0 && (
                <section>
                  <div className="flex items-center gap-2">
                    <Circle className="size-4 text-[#e0a93b]" />
                    <h3 className="text-sm font-semibold text-[#9196b1]">
                      Still Pending ({pending.length})
                    </h3>
                  </div>
                  <ul className="mt-2 ml-6 space-y-1.5">
                    {pending.map(t => (
                      <li key={t._id} className="flex items-center gap-3 text-base text-white">
                        <span>{t.title}</span>
                        {t.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-[#a3a5ab]">
                            <Clock className="size-3" />
                            {formatTime(new Date(t.dueDate))}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: '' })}
      />
    </div>
  )
}
