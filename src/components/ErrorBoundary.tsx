import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import Logo from '@/components/Logo'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.setState({ message: error.message })
    console.error('[AfriCoach] Unhandled error:', error)
  }

  private handleReload = () => {
    window.location.href = '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50/50 px-4">
        <Card className="w-full max-w-md px-8 py-12 text-center">
          <Logo />
          <span className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-sunrise-50 text-sunrise-600">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-xl font-bold text-ink-950">Something went wrong</h1>
          <p className="mt-2 text-sm text-ink-500">
            An unexpected error occurred. Your data is safe — reload the page to continue.
          </p>
          {this.state.message && (
            <p className="mt-3 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500" aria-live="polite">
              {this.state.message}
            </p>
          )}
          <Button className="mt-6" onClick={this.handleReload}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Reload AfriCoach
          </Button>
        </Card>
      </div>
    )
  }
}

export default ErrorBoundary
