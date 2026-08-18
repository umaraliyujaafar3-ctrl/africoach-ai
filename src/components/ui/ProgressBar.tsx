import { cn } from '@/lib/cn'

export interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  ariaLabel?: string
  tone?: 'primary' | 'success' | 'warning' | 'danger'
}

const toneClasses = {
  primary: 'bg-sunrise-500',
  success: 'bg-teal-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  ariaLabel = 'Progress',
  tone = 'primary',
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), max)
  const pct = max === 0 ? 0 : (clamped / max) * 100
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={ariaLabel}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-ink-100', className)}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          toneClasses[tone],
          barClassName,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default ProgressBar
