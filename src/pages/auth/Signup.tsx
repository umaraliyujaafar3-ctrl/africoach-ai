import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import AuthLayout from '@/layouts/AuthLayout'
import GoogleButton from '@/components/GoogleButton'
import { Button, Input, Select } from '@/components/ui'
import { CAREER_FIELDS, type User } from '@/types'

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  careerField?: string
  terms?: string
}

export default function Signup() {
  const navigate = useNavigate()
  const signup = useAuthStore((s) => s.signup)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    careerField: '',
    terms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const next: FormErrors = {}
    if (!form.name.trim()) next.name = 'Please enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address'
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match'
    if (!form.careerField) next.careerField = 'Please select your career field'
    if (!form.terms) next.terms = 'Please accept the terms to continue'
    return next
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setLoading(true)
    setTimeout(() => {
      signup({
        name: form.name.trim(),
        email: form.email.trim(),
        careerField: form.careerField as User['careerField'],
      })
      navigate('/onboarding', { replace: true })
    }, 600)
  }

  const handleGoogle = () => {
    setLoading(true)
    setTimeout(() => {
      signup({ name: 'Guest User', email: 'guest@africoach.ai', careerField: null })
      navigate('/onboarding', { replace: true })
    }, 600)
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-2xl font-bold text-ink-950">Create your account</h1>
      <p className="mt-2 text-sm text-ink-500">
        Start practicing interviews in minutes. Free forever.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <Input
          label="Full name"
          placeholder="Amina Yusuf"
          autoComplete="name"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            error={errors.password}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => setField('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
          />
        </div>
        <Select
          label="Career field"
          placeholder="Select your field"
          value={form.careerField}
          onChange={(e) => setField('careerField', e.target.value)}
          error={errors.careerField}
        >
          {CAREER_FIELDS.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </Select>

        <label className="flex items-start gap-2.5 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => setField('terms', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-ink-300 text-sunrise-500 focus:ring-sunrise-500"
          />
          <span>
            I agree to the <a href="#" className="font-medium text-sunrise-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="font-medium text-sunrise-600 hover:underline">Privacy Policy</a>
          </span>
        </label>
        {errors.terms && (
          <p role="alert" className="text-sm text-red-600">
            {errors.terms}
          </p>
        )}

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Create Account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink-100" />
        <span className="text-xs font-medium text-ink-500">OR</span>
        <span className="h-px flex-1 bg-ink-100" />
      </div>

      <GoogleButton onClick={handleGoogle} loading={loading} />

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-sunrise-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
