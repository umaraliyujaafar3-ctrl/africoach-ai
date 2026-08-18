import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import AuthLayout from '@/layouts/AuthLayout'
import { Button, Input } from '@/components/ui'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address')
      return
    }
    setError(undefined)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 800)
  }

  return (
    <AuthLayout>
      {sent ? (
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-ink-950">Check your inbox</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            We sent a password reset link to <span className="font-semibold text-ink-800">{email}</span>.
            It may take a minute to arrive.
          </p>
          <Link to="/login" className="mt-8 inline-flex">
            <Button variant="secondary" fullWidth>
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold text-ink-950">Forgot your password?</h1>
          <p className="mt-2 text-sm text-ink-500">
            No stress — enter your email and we'll send you a reset link.
          </p>
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
            />
            <Button type="submit" size="lg" fullWidth loading={loading}>
              Send Reset Link
            </Button>
          </form>
          <Link
            to="/login"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </>
      )}
    </AuthLayout>
  )
}
