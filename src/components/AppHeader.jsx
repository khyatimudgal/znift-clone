import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User, LogOut, Key, UserCircle, Check, Archive as ArchiveIcon } from 'lucide-react'
import Logo from './Logo'
import { API } from '../lib/api'

const priorityStyles = {
  high: 'border-[oklch(0.51_0.21_28.41)] text-[oklch(0.7_0.19_21.94)] bg-[#f2543c]/10',
  medium: 'border-[oklch(0.55_0.13_62.52)] text-[oklch(0.86_0.17_89.24)] bg-[#e0a93b]/10',
  low: 'border-[oklch(0.53_0.15_148.98)] text-[oklch(0.79_0.21_151.67)] bg-[#34d399]/10',
}

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [includeArchived, setIncludeArchived] = useState(false)
  const [tasks, setTasks] = useState([])
  const [archivedTasks, setArchivedTasks] = useState([])
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API}/user/me`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(setUser)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    fetch(`${API}/tasks`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setTasks)
      .catch(() => setTasks([]))
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen || !includeArchived) return
    fetch(`${API}/tasks/archived`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setArchivedTasks)
      .catch(() => setArchivedTasks([]))
  }, [searchOpen, includeArchived])

  useEffect(() => {
    if (!menuOpen) return
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  useEffect(() => {
    if (!searchOpen) return
    function onKey(e) {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [searchOpen])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const pool = includeArchived ? [...tasks, ...archivedTasks] : tasks
    return pool.filter(t => t.title.toLowerCase().includes(q)).slice(0, 8)
  }, [query, tasks, archivedTasks, includeArchived])

  function openTask(task) {
    setSearchOpen(false)
    setQuery('')
    navigate(task.archived ? '/archive' : '/tasks')
  }

  async function logout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
    navigate('/login')
  }

  return (
    <header className="border-b border-white/8">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Logo to="/dashboard" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#f9f9f9] hover:bg-white/[0.06] transition-colors"
          >
            <Search className="size-4" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-[#f9f9f9] hover:bg-white/[0.06] transition-colors"
            >
              <User className="size-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-white/10 bg-[#1a1e32] shadow-2xl z-50 overflow-hidden p-1.5">
                {user && (
                  <div className="border-b border-white/8 px-3 py-2.5 mb-1">
                    <div className="text-[15px] font-semibold text-white">{user.username}</div>
                    <div className="text-sm text-[#a3a5ab] truncate">{user.email}</div>
                  </div>
                )}
                <button
                  onClick={() => { setMenuOpen(false); navigate('/profile') }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <UserCircle className="size-4 text-[#a3a5ab]" />
                  Profile
                </button>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <Key className="size-4 text-[#a3a5ab]" />
                  API Keys
                </button>
                <div className="my-1 border-t border-white/8" />
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#f2543c] hover:bg-[#f2543c]/10 transition-colors"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-32"
          onClick={() => setSearchOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-xl border border-white/10 bg-[#13142c] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <Search className="size-4 text-[#a3a5ab]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks..."
                className="flex-1 bg-transparent text-base text-white placeholder-[#6b6e85] outline-none"
              />
            </div>

            {query.trim() && (
              <div className="max-h-80 overflow-y-auto border-t border-white/8">
                {results.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-[#a3a5ab]">No tasks found.</div>
                ) : (
                  results.map(t => (
                    <button
                      key={t._id}
                      onClick={() => openTask(t)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 ${t.completed ? 'border-[#34d399] bg-[#34d399]' : 'border-white/40'}`}>
                        {t.completed ? (
                          <Check className="size-2.5 text-white" strokeWidth={3} />
                        ) : (
                          <span className="size-1.5 rounded-full bg-white/70" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm truncate ${t.completed ? 'text-[#a3a5ab] line-through' : 'text-white'}`}>
                          {t.title}
                        </div>
                        {t.dueDate && (
                          <div className="text-xs text-[#a3a5ab]">
                            {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                      {t.archived && (
                        <span className="flex items-center gap-1 text-xs text-[#a3a5ab]">
                          <ArchiveIcon className="size-3" /> Archived
                        </span>
                      )}
                      {t.priority && (
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs ${priorityStyles[t.priority] || ''}`}>
                          {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}

            <div className="border-t border-white/8 px-4 py-2.5">
              <button
                onClick={() => setIncludeArchived(v => !v)}
                className="flex items-center gap-2 text-sm text-[#a3a5ab]"
              >
                <span className={`flex size-4 items-center justify-center rounded border ${includeArchived ? 'border-[#492ed9] bg-[#492ed9]' : 'border-white/25'}`}>
                  {includeArchived && <Check className="size-3 text-white" strokeWidth={3} />}
                </span>
                Include archived
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
