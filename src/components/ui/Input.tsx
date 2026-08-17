import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-ink-800"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(
            'h-10 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 shadow-soft transition-colors',
            'placeholder:text-ink-400',
            'hover:border-ink-300',
            'focus:border-sunrise-500 focus:outline-none focus:ring-2 focus:ring-sunrise-500/30',
            'disabled:bg-ink-50 disabled:text-ink-400',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/30',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-500">
            {hint}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export default Input
