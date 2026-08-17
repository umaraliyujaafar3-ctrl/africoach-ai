import { Link } from 'react-router-dom'
import { Button, Card } from '@/components/ui'
import Logo from '@/components/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50/50 px-4">
      <Card className="w-full max-w-md px-8 py-12 text-center">
        <Logo />
        <p className="mt-8 font-display text-6xl font-black text-sunrise-500">404</p>
        <h1 className="mt-3 font-display text-xl font-bold text-ink-950">Page not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          The page you're looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Link to="/">
            <Button variant="secondary" className="w-full sm:w-auto">
              Go home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="w-full sm:w-auto">Back to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
