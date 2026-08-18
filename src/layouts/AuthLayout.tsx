import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Logo from '@/components/Logo'

const quotes = [
  {
    quote:
      'Every expert was once a beginner. Every confident candidate was once a nervous one. Keep practicing.',
    author: 'AfriCoach AI',
  },
]

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
        <Link to="/" aria-label="AfriCoach AI home" className="w-fit">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="text-center text-xs text-ink-500">
          © {new Date().getFullYear()} AfriCoach AI
        </p>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden bg-ink-950 lg:block">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sunrise-500/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 -left-24 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" aria-hidden="true" />
        <div className="relative flex h-full flex-col items-center justify-center px-16 text-center">
          <div className="rounded-3xl border border-ink-700/60 bg-ink-900/60 p-8 shadow-lift backdrop-blur">
            <p className="text-2xl font-medium leading-relaxed text-white">
              “{quotes[0].quote}”
            </p>
            <p className="mt-6 text-sm font-semibold text-sunrise-400">{quotes[0].author}</p>
          </div>
          <div className="mt-12 grid w-full max-w-md grid-cols-3 gap-6">
            {[
              { value: '10,000+', label: 'interviews' },
              { value: '3', label: 'languages' },
              { value: '92%', label: 'more confident' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-ink-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
