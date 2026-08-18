import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Globe2,
  Languages,
  Mic,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import Logo from '@/components/Logo'
import Reveal from '@/components/Reveal'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/cn'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Login', href: '/login' },
]

const valueProps = [
  {
    icon: Users,
    title: 'No mentors needed',
    body: 'Your personal AI coach is available 24/7 — practice anytime, anywhere, without waiting on anyone.',
  },
  {
    icon: Target,
    title: 'Built for African hiring',
    body: 'Questions tuned to HR, technical and scholarship interviews across African markets and employers.',
  },
  {
    icon: Zap,
    title: 'Instant feedback',
    body: 'Get real-time scoring on clarity, structure and confidence the moment your answer ends.',
  },
  {
    icon: Languages,
    title: 'Multilingual support',
    body: 'Practice in English, Hausa or French — and keep your accent, keep your confidence.',
  },
]

const steps = [
  {
    icon: CheckCircle2,
    step: '01',
    title: 'Sign up',
    body: 'Create your free account in under a minute.',
  },
  {
    icon: BarChart3,
    step: '02',
    title: 'Upload your CV',
    body: 'Let AfriCoach tailor questions to your experience.',
  },
  {
    icon: Mic,
    step: '03',
    title: 'Practice',
    body: 'Voice or text mock interviews with a realistic AI interviewer.',
  },
  {
    icon: Sparkles,
    step: '04',
    title: 'Get feedback',
    body: 'Detailed scores and tips that turn weaknesses into strengths.',
  },
]

const features = [
  {
    icon: Bot,
    title: 'AI Mock Interviews',
    body: 'Realistic interview sessions that feel like the real thing.',
  },
  {
    icon: Mic,
    title: 'Voice & Text',
    body: 'Speak your answers or type them — pick what suits you.',
  },
  {
    icon: Target,
    title: 'STAR Method Coaching',
    body: 'Structure behavioral answers with built-in STAR guidance.',
  },
  {
    icon: Languages,
    title: 'Multilingual Support',
    body: 'Practice in English, Hausa or French with more on the way.',
  },
  {
    icon: BarChart3,
    title: 'Performance Dashboard',
    body: 'Track your scores and improvement over time.',
  },
  {
    icon: Sparkles,
    title: 'AI Career Assistant',
    body: 'CV reviews, cover letters and career advice on demand.',
  },
]

const testimonials = [
  {
    quote:
      'I failed two HR interviews before AfriCoach. Two weeks of daily practice and I walked into my third one calm and prepared — I got the job.',
    name: 'Adaeze O.',
    role: 'Software Engineer, Lagos',
    initials: 'AO',
  },
  {
    quote:
      'The voice mode feels exactly like a real interview. The feedback on my answers was sharper than anything a mentor gave me.',
    name: 'Yusuf M.',
    role: 'Graduate Trainee, Nairobi',
    initials: 'YM',
  },
  {
    quote:
      'Practicing in Hausa first, then English, completely changed how I answered. The confidence carried straight into my scholarship interview.',
    name: 'Fatima B.',
    role: 'Scholarship Applicant, Abuja',
    initials: 'FB',
  },
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-ink-800">
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-300',
          scrolled ? 'border-b border-ink-100 bg-white/85 backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="AfriCoach AI home">
            <Logo />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) =>
              link.href.startsWith('#') ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-ink-600 transition-colors hover:text-sunrise-600"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-ink-600 transition-colors hover:text-sunrise-600"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link to="/signup">
              <Button>Get Started Free</Button>
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50 md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>
        {menuOpen && (
          <div className="border-t border-ink-100 bg-white px-4 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.href.startsWith('#') ? (
                  <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-ink-700">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} to={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-ink-700">
                    {link.label}
                  </Link>
                ),
              )}
              <Link to="/signup">
                <Button fullWidth>Get Started Free</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-sunrise-50 via-white to-white pt-28 pb-16 sm:pt-36 sm:pb-24">
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sunrise-200/40 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute top-40 -left-24 h-80 w-80 rounded-full bg-teal-100/40 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Badge tone="primary" className="mb-5">
                  <Sparkles className="h-3.5 w-3.5" /> AI interview coaching, built for Africa
                </Badge>
                <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
                  Walk into your next interview with{' '}
                  <span className="bg-gradient-to-r from-sunrise-500 to-sunrise-600 bg-clip-text text-transparent">
                    total confidence
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg text-ink-600">
                  Practice realistic mock interviews with an AI coach built for African students
                  and job seekers — in your language, on your schedule, with instant feedback.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link to="/signup">
                    <Button size="lg" fullWidth className="sm:w-auto">
                      Start Practicing <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="#how-it-works">
                    <Button size="lg" variant="ghost" fullWidth className="sm:w-auto">
                      See How It Works
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-16 max-w-4xl"
            >
              <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-lift">
                <div className="flex items-center gap-3 border-b border-ink-100 pb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sunrise-500 text-white">
                    <Bot className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">AfriCoach Interviewer</p>
                    <p className="text-xs text-ink-500">HR · Behavioral · Text mode</p>
                  </div>
                  <Badge tone="success">
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-teal-500" />
                    Live
                  </Badge>
                </div>
                <div className="space-y-4 py-5">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-ink-50 px-4 py-3">
                    <p className="text-sm text-ink-800">
                      Hello! I'm your interviewer for today. Tell me a bit about yourself and why
                      you're interested in this role.
                    </p>
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-sunrise-500 px-4 py-3">
                    <p className="text-sm text-white">
                      I'm a final-year software engineering student passionate about building
                      products that solve real problems across Africa…
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sunrise-500 text-white">
                      <Bot className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="flex gap-1 rounded-full bg-ink-50 px-4 py-2.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-ink-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t border-ink-100 pt-4">
                  <input
                    type="text"
                    readOnly
                    placeholder="Type your answer…"
                    aria-label="Type your answer"
                    className="h-11 flex-1 rounded-xl border border-ink-200 bg-white px-4 text-sm placeholder:text-ink-500 focus:outline-none"
                  />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-white">
                    <Mic className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <Button size="sm" className="h-11 px-5">
                    Send
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-y border-ink-100 bg-white py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4 sm:px-6 lg:px-8">
            {[
              { value: '10,000+', label: 'interviews practiced' },
              { value: '4,200+', label: 'students coached' },
              { value: '3', label: 'languages supported' },
              { value: '92%', label: 'feel more confident' },
            ].map((stat) => (
              <Reveal key={stat.label} delay={0.1}>
                <p className="font-display text-3xl font-bold text-ink-950">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="why" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge tone="primary" className="mb-4">Why AfriCoach AI</Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
                Your unfair advantage before the interview even starts
              </h2>
              <p className="mt-4 text-lg text-ink-600">
                Most African job seekers never get a practice run. AfriCoach gives you thousands,
                free.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {valueProps.map((prop, i) => (
                <Reveal key={prop.title} delay={i * 0.08}>
                  <Card hoverable className="h-full">
                    <CardContent className="flex h-full flex-col">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sunrise-50 text-sunrise-600">
                        <prop.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-base font-semibold text-ink-900">{prop.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">{prop.body}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-ink-950 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge tone="primary" className="mb-4">How It Works</Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                From signup to job-ready in four steps
              </h2>
              <p className="mt-4 text-lg text-ink-300">
                A simple process designed to get you practicing today.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.1}>
                  <div className="relative">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunrise-500 text-white shadow-lift">
                      <step.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="mt-4 block font-display text-sm font-bold text-sunrise-400">
                      Step {step.step}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-300">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge tone="primary" className="mb-4">Features</Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
                Everything you need to ace the interview
              </h2>
              <p className="mt-4 text-lg text-ink-600">
                A complete practice toolkit, powered by AI and tuned to African hiring.
              </p>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <Reveal key={feature.title} delay={i * 0.06}>
                  <Card hoverable className="h-full">
                    <CardContent className="flex h-full flex-col">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-sunrise-400">
                        <feature.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-base font-semibold text-ink-900">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-500">{feature.body}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-sunrise-50/60 to-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <Badge tone="success" className="mb-4">
                <Users className="h-3.5 w-3.5" /> Loved by job seekers
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
                Stories from real practice sessions
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.1}>
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col">
                      <div className="flex gap-0.5 text-sunrise-500" aria-label="5 out of 5 stars">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                            <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 0 0 .95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 0 0-.36 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 0 0-1.18 0l-2.8 2.03c-.79.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 0 0-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 0 0 .95-.69l1.07-3.29Z" />
                          </svg>
                        ))}
                      </div>
                      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                        “{t.quote}”
                      </blockquote>
                      <footer className="mt-6 flex items-center gap-3 border-t border-ink-100 pt-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sunrise-500 text-xs font-bold text-white">
                          {t.initials}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{t.name}</p>
                          <p className="text-xs text-ink-500">{t.role}</p>
                        </div>
                      </footer>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-16 text-center shadow-lift sm:px-16">
                <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-sunrise-500/20 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" aria-hidden="true" />
                <h2 className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to walk into your next interview with confidence?
                </h2>
                <p className="relative mx-auto mt-4 max-w-xl text-lg text-ink-300">
                  Join thousands of African students and job seekers practicing smarter every day.
                  Free to start — no credit card required.
                </p>
                <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link to="/signup">
                    <Button size="lg" fullWidth className="sm:w-auto">
                      Get Started Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-100 bg-ink-50/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <Logo />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
                AI-powered interview coaching built for African students and job seekers. Practice
                smarter, answer better, get hired.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">Product</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
                <li><a href="#features" className="transition-colors hover:text-sunrise-600">Features</a></li>
                <li><a href="#how-it-works" className="transition-colors hover:text-sunrise-600">How it works</a></li>
                <li><a href="#pricing" className="transition-colors hover:text-sunrise-600">Pricing</a></li>
                <li><Link to="/login" className="transition-colors hover:text-sunrise-600">Login</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">Connect</p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-500">
                <li><a href="#" className="transition-colors hover:text-sunrise-600">Twitter / X</a></li>
                <li><a href="#" className="transition-colors hover:text-sunrise-600">LinkedIn</a></li>
                <li><a href="#" className="transition-colors hover:text-sunrise-600">Instagram</a></li>
                <li><a href="#" className="transition-colors hover:text-sunrise-600">hello@africoach.ai</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-100 pt-6 sm:flex-row">
            <p className="text-xs text-ink-500">
              © {new Date().getFullYear()} AfriCoach AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-ink-500">
              <a href="#" className="transition-colors hover:text-ink-700">Privacy</a>
              <a href="#" className="transition-colors hover:text-ink-700">Terms</a>
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5" aria-hidden="true" /> Made for Africa
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
