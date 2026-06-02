import { Link } from "react-router-dom"
import {
  Zap,
  Keyboard,
  Search,
  Clock,
  FileText,
  Bot,
  CalendarDays,
  Flame,
  Layers,
  Gauge,
  Check,
  ArrowRight,
  CircleCheck,
  CircleX,
  Moon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo"

function Kbd({ children, className = "" }) {
  return (
    <kbd
      className={`inline-flex items-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-xs text-foreground/80 ${className}`}
    >
      {children}
    </kbd>
  )
}

/* ----------------------------- Navbar ----------------------------- */
function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#0a0b1e]/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Logo />
        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#journey" className="transition-colors hover:text-foreground">Journey</a>
            <a href="#" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#" className="transition-colors hover:text-foreground">Docs</a>
          </div>
          <Button asChild className="rounded-lg px-4">
            <Link to="/register">Start logging</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}

/* --------------------------- Hero preview -------------------------- */
function HeroPreview() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-card/80 shadow-2xl shadow-black/50 backdrop-blur-sm">
      <div className="flex items-start justify-between border-b border-white/8 p-5">
        <div>
          <h3 className="text-base font-semibold">Good morning, Alex</h3>
          <p className="text-xs text-muted-foreground">Thursday, February 6, 2026</p>
        </div>
        <span className="text-xs text-muted-foreground">3 pending · 3 completed</span>
      </div>

      <div className="max-h-[400px] space-y-4 overflow-y-auto p-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-destructive">
            Overdue
          </p>
          <TaskRow label="Review PR #487 - Auth refactor" tag="High" overdue />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Today
          </p>
          <div className="space-y-1.5">
            <TaskRow label="Ship landing page updates" time="2:00 PM" />
            <TaskRow label="Team standup" time="10:00 AM" done />
            <TaskRow label="Fix checkout flow bug" tag="High" />
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-success">
            Completed
          </p>
          <div className="space-y-1.5">
            <TaskRow label="Deploy v2.1 to staging" done />
            <TaskRow label="Write API migration docs" done />
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskRow({ label, time, tag, done, overdue }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
        overdue
          ? "border-destructive/30 bg-destructive/5"
          : "border-white/8 bg-white/[0.02]"
      }`}
    >
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded border ${
          done
            ? "border-success bg-success text-white"
            : overdue
            ? "border-destructive/60"
            : "border-white/25"
        }`}
      >
        {done && <Check className="size-3" strokeWidth={3} />}
      </span>
      <span
        className={`flex-1 truncate text-sm ${
          done ? "text-muted-foreground line-through" : "text-foreground/90"
        }`}
      >
        {label}
      </span>
      {tag && (
        <span className="rounded bg-destructive/15 px-1.5 py-0.5 text-[11px] font-medium text-destructive">
          {tag}
        </span>
      )}
      {time && <span className="text-xs text-muted-foreground">{time}</span>}
    </div>
  )
}

/* ------------------------------ Hero ------------------------------ */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <GridDots />
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 pb-28 pt-48 lg:grid-cols-2 lg:gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            For builders who ship daily
          </p>
          <h1 className="mt-6 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            The keyboard-first task tracker for builders.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Stop remembering. Start shipping. Press <Kbd>⌘+L</Kbd> to log what
            you just did — no forms, no clicks, no overhead.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-11 rounded-lg px-6 text-base">
              <Link to="/register">Start logging</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-11 rounded-lg px-6 text-base">
              <a href="#features">See how it works</a>
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Free during early access. No credit card required.
          </p>
        </div>

        <div className="lg:pl-6">
          <HeroPreview />
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Features --------------------------- */
function FeatureCard({ icon: Icon, title, description, children }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-card/30 p-8">
      <div className="flex h-40 items-center justify-center overflow-hidden">
        {children}
      </div>
      <Icon className="mt-4 size-6 text-brand" />
      <h3 className="mt-4 text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}

function Features() {
  return (
    <section id="features" className="relative z-10 bg-[#0d1125] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            Built for speed. Not meetings about speed.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every feature earns its place by making you faster.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <FeatureCard
            icon={Keyboard}
            title="⌘+L to log"
            description="Done something? Log it without breaking flow. No forms, no clicks—just type and move on."
          >
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2.5">
              <Kbd>⌘+L</Kbd>
              <span className="text-sm text-muted-foreground">Log task...</span>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Search}
            title="Find anything"
            description={'"When did I deploy v2?" Search your history and jump straight to that day.'}
          >
            <div className="w-full max-w-xs space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
                <Search className="size-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">deploy v2</span>
              </div>
              <div className="flex items-center justify-between px-1 text-sm">
                <span className="text-foreground/80">Deploy v2 to prod</span>
                <span className="text-xs text-muted-foreground">Jan 15</span>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Clock}
            title="Natural time input"
            description={'Type "2h 30m" for duration, "3pm" for due time — Znift parses both. No dropdowns, no date pickers.'}
          >
            <div className="flex w-full max-w-[200px] flex-col gap-2">
              <div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-foreground/80">2h 30m</div>
              <div className="self-center rounded-lg bg-white/5 px-3 py-1.5 text-sm text-foreground/80">3pm</div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={FileText}
            title="Summary view"
            description="See what you planned, what you did, and what slipped. Pick any day or date range—perfect for standups."
          >
            <div className="space-y-1.5 text-sm">
              <p className="text-muted-foreground">Yesterday:</p>
              <p className="flex items-center gap-2 text-foreground/90"><Check className="size-3.5 text-success" /> Fixed auth bug</p>
              <p className="flex items-center gap-2 text-foreground/90"><Check className="size-3.5 text-success" /> Reviewed 3 PRs</p>
              <p className="flex items-center gap-2 text-muted-foreground"><span className="inline-block size-3.5 rounded-full border border-muted-foreground/50" /> Deploy to prod</p>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Zap}
            title="Keyboard everything"
            description="Navigate, create, search, complete—all without touching your mouse."
          >
            <div className="flex flex-col items-center gap-2.5">
              <div className="flex gap-2">
                <Kbd className="px-2 py-1">⌘+K</Kbd>
                <Kbd className="px-2 py-1">⌘+S</Kbd>
              </div>
              <div className="flex gap-2">
                <Kbd className="px-2 py-1">Space</Kbd>
                <Kbd className="px-2 py-1">J/K</Kbd>
                <Kbd className="px-2 py-1">1-3</Kbd>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Bot}
            title="Works with your AI agent"
            description={'MCP server, REST API, OpenAPI spec. Tell Claude or ChatGPT to manage your tasks. "What\'s on my plate today?"'}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                <Bot className="size-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">"What do I have to do today?"</span>
              </div>
              <div className="flex gap-2">
                <Kbd className="px-2 py-1">Claude</Kbd>
                <Kbd className="px-2 py-1">ChatGPT</Kbd>
                <Kbd className="px-2 py-1">Cursor</Kbd>
              </div>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={CalendarDays}
            title="Calendar sync"
            description="Tasks with due times appear on your Google Calendar automatically."
          >
            <CalendarDays className="size-12 text-brand/80" strokeWidth={1.25} />
          </FeatureCard>

          <FeatureCard
            icon={Flame}
            title="Build momentum"
            description="Log one task a day. Watch your streak grow. Stay consistent."
          >
            <div className="flex items-end gap-1">
              {[3, 4, 4, 5, 6, 6, 7, 8, 8, 9, 11, 10, 12].map((h, i) => (
                <span
                  key={i}
                  className="w-2 rounded-sm bg-brand/60"
                  style={{ height: `${h * 6}px` }}
                />
              ))}
              <Flame className="ml-2 size-6 text-brand" />
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}

/* --------------------------- Comparison --------------------------- */
const withoutZnift = [
  'End of day: "Wait, what did I actually do today?"',
  "Before standup: Scramble through Slack, commits, and calendar trying to reconstruct yesterday",
  "To log one task: Open app → navigate → click → fill form → pick date → save",
  'Last week: "When did I deploy that?" No idea. No way to search.',
]

const withZnift = [
  ["To log one task: ", "⌘+L", " → type → Enter. Back to building."],
  ["Before standup: ", "⌘+U", " → copy markdown → paste in Slack. 5 seconds."],
  ["End of day: Open summary. It's all there.", null, ""],
  ["Last week: ", "⌘+S", ' → "deploy" → Jan 15. Found it.'],
]

function Comparison() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">
            How you work now vs. how you could
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Most task apps want you to plan first. You don't work that way.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.04] p-8">
            <h3 className="flex items-center gap-2.5 text-xl font-bold">
              <CircleX className="size-6 text-destructive" />
              Without Znift
            </h3>
            <ul className="mt-7 space-y-5">
              {withoutZnift.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-destructive/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-card/40 p-8">
            <h3 className="flex items-center gap-2.5 text-xl font-bold">
              <CircleCheck className="size-6 text-success" />
              With Znift
            </h3>
            <ul className="mt-7 space-y-5">
              {withZnift.map(([pre, key, post], i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-brand/60" />
                  <span>
                    {pre}
                    {key && <Kbd>{key}</Kbd>}
                    {post}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- Journey ---------------------------- */
const journey = [
  {
    icon: Layers,
    title: 'We tried the "do-everything" apps',
    description:
      "Powerful, but bloated. We needed a task logger, not a database-wiki-project-management Swiss army knife.",
  },
  {
    icon: Gauge,
    title: "We tried the built-in tools",
    description:
      "Too basic. No global shortcut. Open app, navigate, click, type, save. Every. Single. Time.",
  },
  {
    icon: FileText,
    title: "We tried plain text notes",
    description:
      "Flexible, but chaos. No search, no streaks, no exports. Just notes we'd never look at again.",
  },
  {
    icon: Zap,
    title: "So we built Znift",
    description:
      "Cmd+L from anywhere. Log without breaking flow. Track streaks. Export standups. Sync to calendar.",
    highlight: true,
  },
]

function Journey() {
  return (
    <section id="journey" className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight">The journey to Znift</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            How we built the tool we always wanted.
          </p>
        </div>

        <div className="mt-16">
          {journey.map(({ icon: Icon, title, description, highlight }, i) => (
            <div key={title} className="relative flex gap-6 pb-12 last:pb-0">
              {i < journey.length - 1 && (
                <span className="absolute left-5 top-12 h-[calc(100%-2.5rem)] w-px bg-white/10" />
              )}
              <div
                className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  highlight
                    ? "bg-brand text-white"
                    : "border border-white/10 bg-card text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex flex-1 items-start justify-between gap-6 pt-1">
                <div>
                  <h3 className={`text-xl font-bold tracking-tight ${highlight ? "text-brand" : ""}`}>
                    {title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
                <Icon className={`size-7 shrink-0 ${highlight ? "text-brand" : "text-muted-foreground/60"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- CTA ------------------------------ */
function FinalCta() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:whitespace-nowrap">
          Your work deserves to be remembered.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
          Free during early access. No credit card required. Start logging and
          never scramble before a standup again.
        </p>
        <Button asChild size="lg" className="mt-9 h-11 rounded-lg px-6 text-base">
          <Link to="/register">
            Start logging
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

/* ------------------------------ Footer ---------------------------- */
function Footer() {
  return (
    <footer className="py-12">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-6 sm:flex-row">
        <div>
          <Logo big />
          <p className="mt-4 text-sm text-[#969bb6]">
            The keyboard-first task tracker for builders.
          </p>
          <p className="mt-4 text-sm text-[#969bb6]">© 2026 Znift</p>
        </div>

        <div className="flex flex-col items-start gap-5 sm:items-end">
          <nav className="flex items-center gap-6 text-sm text-[#969bb6]">
            <a href="#" aria-label="X" className="transition-colors hover:text-foreground">
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="transition-colors hover:text-foreground">Docs</a>
            <a href="#" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
            <a href="#" className="transition-colors hover:text-foreground">Terms</a>
          </nav>
          <button className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-[#969bb6] transition-colors hover:text-foreground">
            <Moon className="size-4" />
            Dark
          </button>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------ Page ------------------------------ */
const particles = [
  { top: "8%", left: "55%", s: 6, d: 4.5, delay: 0 }, { top: "14%", left: "82%", s: 4, d: 5.5, delay: 1.2 },
  { top: "22%", left: "12%", s: 5, d: 6, delay: 0.6 }, { top: "30%", left: "92%", s: 7, d: 4, delay: 2 },
  { top: "6%", left: "30%", s: 4, d: 5, delay: 1.8 }, { top: "44%", left: "6%", s: 5, d: 6.5, delay: 0.3 },
  { top: "52%", left: "78%", s: 8, d: 4.2, delay: 1.5 }, { top: "62%", left: "22%", s: 5, d: 5.8, delay: 2.4 },
  { top: "70%", left: "90%", s: 6, d: 5, delay: 0.9 }, { top: "78%", left: "44%", s: 7, d: 4.6, delay: 3 },
  { top: "86%", left: "70%", s: 5, d: 6, delay: 1.1 }, { top: "94%", left: "16%", s: 6, d: 5.2, delay: 2.2 },
  { top: "38%", left: "60%", s: 4, d: 5.6, delay: 0.5 }, { top: "18%", left: "68%", s: 7, d: 4.4, delay: 1.7 },
  { top: "58%", left: "50%", s: 5, d: 6.2, delay: 2.8 }, { top: "26%", left: "40%", s: 4, d: 5.4, delay: 0.8 },
  { top: "48%", left: "88%", s: 6, d: 4.8, delay: 2.6 }, { top: "66%", left: "8%", s: 8, d: 5, delay: 1.4 },
  { top: "82%", left: "58%", s: 4, d: 6.4, delay: 0.2 }, { top: "12%", left: "48%", s: 5, d: 4.9, delay: 2.1 },
]

function GridDots({ glow = true }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* glowing, pulsing circles */}
      {glow && particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.s,
            height: p.s,
            background: "#7c63ff",
            boxShadow: `0 0 ${p.s * 2.5}px ${p.s * 0.8}px rgba(91,61,245,0.9)`,
            animation: `twinkle ${p.d}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function Landing() {
  return (
    <div className="relative min-h-screen bg-[#0a0b1e] text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <div className="relative z-10 bg-[#090b1c]">
          <Comparison />
          <Journey />
        </div>
        <div className="relative z-10 overflow-hidden">
          <GridDots glow={false} />
          <div className="relative z-10">
            <FinalCta />
            <Footer />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing
