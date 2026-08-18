import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  primary: 'bg-sunrise-50 text-sunrise-700 ring-sunrise-200',
  success: 'bg-teal-50 text-teal-700 ring-teal-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  neutral: 'bg-ink-50 text-ink-600 ring-ink-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}

export default Badge
