import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Moon } from 'lucide-react'
import Logo from '../components/Logo'
import { API } from '../lib/api'

function GridDots() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  )
}

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        navigate('/dashboard')
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      console.log(err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0a0b1e] text-foreground overflow-hidden">
      <GridDots />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="mb-8">
          <Logo />
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/8 bg-[#13142c]/60 backdrop-blur-sm p-8 sm:p-10">
          <h1 className="text-3xl font-bold text-white text-center">Sign in to Znift</h1>
          <p className="mt-2 text-sm text-[#a3a5ab] text-center">
            Welcome back. Enter your details to continue.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-[#f2543c]/40 bg-[#f2543c]/10 px-4 py-3 text-sm text-[#f2543c]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#1b1c34] text-white placeholder-[#6b6e85] border border-white/10 outline-none focus:border-[#492ed9] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#1b1c34] text-white placeholder-[#6b6e85] border border-white/10 outline-none focus:border-[#492ed9] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#492ed9] hover:bg-[#3e29c4] text-white font-medium transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-sm text-[#a3a5ab] text-center">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-[#492ed9] hover:underline cursor-pointer font-medium"
          >
            Sign up
          </span>
        </p>

        <p className="mt-2 text-sm text-[#a3a5ab] text-center">
          The keyboard-first task tracker for builders.
        </p>
      </div>

      <div className="absolute bottom-6 left-6 z-10 flex gap-6 text-sm text-[#a3a5ab]">
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
        <a href="#" className="hover:text-white transition-colors">Terms</a>
      </div>

      <div className="absolute bottom-6 right-6 z-10">
        <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/[0.06] transition-colors">
          <Moon className="size-4" />
          Dark
        </button>
      </div>
    </div>
  )
}

export default Login
