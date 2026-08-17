import { cn } from '@/lib/cn'

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sunrise-400 to-sunrise-600 text-white shadow-soft">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path
            d="M12 3C7.03 3 3 6.58 3 11c0 2.4 1.16 4.56 3 6.06V19a1 1 0 0 0 1.63.78L10 18h4l2.37 1.78A1 1 0 0 0 18 19v-1.94c1.84-1.5 3-3.66 3-6.06 0-4.42-4.03-8-9-8Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span
        className={cn(
          'font-display text-lg font-bold tracking-tight',
          light ? 'text-white' : 'text-ink-900',
        )}
      >
        AfriCoach<span className="text-sunrise-500"> AI</span>
      </span>
    </span>
  )
}

export default Logo
