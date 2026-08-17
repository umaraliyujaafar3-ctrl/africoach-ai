import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-sunrise-500 text-white shadow-soft hover:bg-sunrise-600 focus-visible:shadow-glow active:bg-sunrise-700',
  secondary:
    'bg-ink-900 text-white hover:bg-ink-800 focus-visible:shadow-glow active:bg-ink-950',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-50 hover:text-ink-900 focus-visible:shadow-glow',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:shadow-glow active:bg-red-800',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
        'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-inherit" />}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'

export function Spinner({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-ink-200 border-t-ink-900',
        sizes[size],
        className,
      )}
    />
  )
}

export function Loader({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-10 text-ink-500', className)}>
      <Spinner size="lg" />
      <span className="text-sm" role="status">
        {label}
      </span>
    </div>
  )
}

export default Button
