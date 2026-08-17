import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useToastStore, toastIcons } from '@/store/toast'

const typeStyles = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-sky-400',
}

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const remove = useToastStore((s) => s.remove)

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-4 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col items-center gap-2 sm:left-auto sm:right-4 sm:translate-x-0 sm:items-end"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = toastIcons[t.type]
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="pointer-events-auto flex w-full items-center gap-3 rounded-xl border border-ink-100 bg-ink-900 px-4 py-3 text-sm font-medium text-white shadow-lift"
            >
              <Icon className={`h-5 w-5 shrink-0 ${typeStyles[t.type]}`} aria-hidden="true" />
              <span className="flex-1">{t.message}</span>
              <button
                type="button"
                onClick={() => remove(t.id)}
                aria-label="Dismiss notification"
                className="rounded-md p-1 text-ink-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default ToastViewport
