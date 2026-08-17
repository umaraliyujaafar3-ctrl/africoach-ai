import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import AuthLayout from '@/layouts/AuthLayout'
import GoogleButton from '@/components/GoogleButton'
import { Button, Input } from '@/components/ui'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string>()
  const [passwordError, setPasswordError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    let valid = true
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address')
      valid = false
    } else setEmailError(undefined)
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      valid = false
    } else setPasswordError(undefined)
    if (!valid) return
    setLoading(true)
    setTimeout(() => {
      login(email.trim())
      navigate('/dashboard', { replace: true })
    }, 600)
  }

  const handleGoogle = () => {
    setLoading(true)
    setTimeout(() => {
      login('guest@africoach.ai')
      navigate('/dashboard', { replace: true })
    }, 600)
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-ink-950">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-500">Log in to continue your practice streak.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
          />
          <div className="mt-2 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-sunrise-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Log In
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink-100" />
        <span className="text-xs font-medium text-ink-500">OR</span>
        <span className="h-px flex-1 bg-ink-100" />
      </div>

      <GoogleButton onClick={handleGoogle} loading={loading} />

      <p className="mt-6 text-center text-sm text-ink-500">
        New to AfriCoach AI?{' '}
        <Link to="/signup" className="font-semibold text-sunrise-600 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
