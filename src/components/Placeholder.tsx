import { Construction } from 'lucide-react'

export function Placeholder({ title, note }: { title: string; note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-white px-6 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-400">
        <Construction className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-display text-xl font-bold text-ink-900">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        {note ?? 'This page is coming up in the next build step.'}
      </p>
    </div>
  )
}

export default Placeholder
