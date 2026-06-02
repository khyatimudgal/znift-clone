import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trash2, Flag, Trash, AlertTriangle } from 'lucide-react'
import AppHeader from '../components/AppHeader'
import Toast from '../components/Toast'
import { API } from '../lib/api'

const priorityStyles = {
  high: 'border-[oklch(0.51_0.21_28.41)] text-[oklch(0.7_0.19_21.94)] bg-[#f2543c]/10',
  medium: 'border-[oklch(0.55_0.13_62.52)] text-[oklch(0.86_0.17_89.24)] bg-[#e0a93b]/10',
  low: 'border-[oklch(0.53_0.15_148.98)] text-[oklch(0.79_0.21_151.67)] bg-[#34d399]/10',
}

function formatArchivedDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Archive() {
  const [tasks, setTasks] = useState([])
  const [toast, setToast] = useState({ open: false, message: '' })
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => { load() }, [])

  function load() {
    fetch(`${API}/tasks/archived`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setTasks)
      .catch(() => setTasks([]))
  }

  async function restore(task) {
    await fetch(`${API}/tasks/${task._id}/restore`, { method: 'PATCH', credentials: 'include' })
    setToast({ open: true, message: 'Task restored' })
    load()
  }

  async function remove(task) {
    await fetch(`${API}/tasks/${task._id}`, { method: 'DELETE', credentials: 'include' })
    setToast({ open: true, message: 'Task deleted permanently' })
    load()
  }

  async function deleteAll() {
    await fetch(`${API}/tasks/archived/all`, { method: 'DELETE', credentials: 'include' })
    setConfirmOpen(false)
    setToast({ open: true, message: 'All archived tasks deleted' })
    load()
  }

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Link to="/tasks" className="inline-flex items-center gap-2 text-[15px] font-medium text-[#f9f9f9] hover:text-[#a3a5ab] transition-colors">
          <ArrowLeft className="size-4" /> Back to Tasks
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">Archived Tasks</h1>
            <p className="mt-2 text-[#979cb7]">Tasks you've archived. Restore them or delete permanently.</p>
          </div>
          {tasks.length > 0 && (
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-2 rounded-md border border-[#f2543c]/40 bg-[#f2543c]/10 px-3 py-1.5 text-xs text-[#f2543c] hover:bg-[#f2543c]/20 transition-colors"
            >
              <Trash className="size-3.5" /> Delete all
            </button>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="mt-16 rounded-xl border border-white/8 bg-white/[0.02] p-12 text-center">
            <p className="text-[#a3a5ab]">No archived tasks.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {tasks.map(task => (
              <div
                key={task._id}
                className="flex items-center gap-4 rounded-xl border border-white/8 bg-[oklch(0.2_0.04_277.84)] px-5 py-4"
              >
                <div className="flex-1">
                  <div className="text-[15px] text-white">{task.title}</div>
                  <div className="mt-1 text-[13px] text-[oklch(0.6_0.04_278.28)]">
                    Archived {formatArchivedDate(task.archivedAt || task.updatedAt)}
                  </div>
                </div>
                {task.priority && task.priority !== 'medium' && (
                  <span className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${priorityStyles[task.priority]}`}>
                    <Flag className="size-3" /> {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                )}
                <button
                  onClick={() => restore(task)}
                  title="Restore"
                  className="flex size-8 items-center justify-center rounded text-[#a3a5ab] hover:bg-white/5 hover:text-white transition-colors"
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  onClick={() => remove(task)}
                  title="Delete permanently"
                  className="flex size-8 items-center justify-center rounded text-[#a3a5ab] hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast({ open: false, message: '' })}
      />

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          onClick={() => setConfirmOpen(false)}
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
                <h2 className="text-lg font-semibold text-white">Delete all archived tasks?</h2>
                <p className="mt-1 text-sm text-[#979cb7]">
                  This will permanently delete {tasks.length} task{tasks.length === 1 ? '' : 's'}. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteAll}
                className="flex items-center gap-2 rounded-md bg-[#f2543c] hover:bg-[#d8462f] px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                <Trash className="size-4" /> Delete all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
