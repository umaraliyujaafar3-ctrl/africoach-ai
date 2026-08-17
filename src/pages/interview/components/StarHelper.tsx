import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ClipboardPaste, Lightbulb, Sparkles, Star, X } from 'lucide-react'
import { Button, Textarea } from '@/components/ui'
import { cn } from '@/lib/cn'

const STAR_ELEMENTS = [
  {
    letter: 'S',
    title: 'Situation',
    color: 'bg-sky-500',
    prompt: 'Set the scene. Where were you, what was the context?',
    placeholder: 'e.g. During my final-year project at university…',
  },
  {
    letter: 'T',
    title: 'Task',
    color: 'bg-amber-500',
    prompt: 'What were you responsible for?',
    placeholder: 'e.g. I was tasked with leading the team to deliver…',
  },
  {
    letter: 'A',
    title: 'Action',
    color: 'bg-sunrise-500',
    prompt: 'What specific steps did YOU take?',
    placeholder: 'e.g. I created a timeline, delegated tasks, and…',
  },
  {
    letter: 'R',
    title: 'Result',
    color: 'bg-emerald-500',
    prompt: 'What was the outcome? Add numbers if you can.',
    placeholder: 'e.g. We delivered two weeks early and I got a 92% score…',
  },
]

const EXAMPLE = `While leading my group's final-year software project (Situation), I was responsible for making sure we delivered a working product on schedule (Task). I set up a shared task board, ran daily 15-minute standups, and took on the trickiest module myself when a teammate fell behind (Action). We delivered two weeks early, scored 92%, and my teammates rated me the most reliable member of the group (Result).`

interface StarHelperProps {
  open: boolean
  onClose: () => void
  onInsert: (text: string) => void
}

export function StarHelper({ open, onClose, onInsert }: StarHelperProps) {
  const [tab, setTab] = useState<'guide' | 'example' | 'build'>('guide')
  const [parts, setParts] = useState({ S: '', T: '', A: '', R: '' })

  const combined =
    [parts.S, parts.T, parts.A, parts.R].filter((p) => p.trim()).join(' ') || ''

  const insert = () => {
    if (!combined.trim()) return
    onInsert(combined)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close STAR helper"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-ink-950/30 backdrop-blur-[1px] lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            aria-label="STAR method helper"
            className="absolute inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col border-l border-ink-100 bg-white shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
              <p className="flex items-center gap-2 font-display text-base font-bold text-ink-900">
                <Sparkles className="h-4 w-4 text-sunrise-500" aria-hidden="true" /> STAR Method Helper
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close STAR helper"
                className="rounded-lg p-1.5 text-ink-500 hover:bg-ink-50 hover:text-ink-700"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex gap-1 border-b border-ink-100 px-4 pt-3">
              {(
                [
                  { id: 'guide', label: 'Guide' },
                  { id: 'example', label: 'Example' },
                  { id: 'build', label: 'Build' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium transition-colors',
                    tab === t.id
                      ? 'border-sunrise-500 text-sunrise-700'
                      : 'border-transparent text-ink-500 hover:text-ink-800',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {tab === 'guide' && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-ink-500">
                    The STAR framework turns a messy story into a crisp, structured answer that
                    interviewers love.
                  </p>
                  {STAR_ELEMENTS.map((el) => (
                    <div key={el.title} className="flex gap-3">
                      <span
                        className={cn(
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white',
                          el.color,
                        )}
                      >
                        {el.letter}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{el.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{el.prompt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'example' && (
                <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                    <Lightbulb className="h-4 w-4 text-sky-600" aria-hidden="true" /> Example — "Tell me
                    about a challenge"
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{EXAMPLE}</p>
                  <p className="mt-3 text-xs text-sky-700">
                    See the flow? Situation → Task → Action → Result.
                  </p>
                </div>
              )}

              {tab === 'build' && (
                <div className="space-y-4">
                  <p className="text-sm text-ink-500">
                    Fill in the four parts and we'll combine them into a polished answer.
                  </p>
                  {STAR_ELEMENTS.map((el) => {
                    const key = el.letter as keyof typeof parts
                    return (
                      <div key={el.title}>
                        <label
                          htmlFor={`star-${el.letter}`}
                          className="mb-1.5 flex items-center gap-2 text-sm font-medium text-ink-800"
                        >
                          <span
                            className={cn(
                              'flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white',
                              el.color,
                            )}
                          >
                            {el.letter}
                          </span>
                          {el.title}
                        </label>
                        <Textarea
                          id={`star-${el.letter}`}
                          rows={2}
                          placeholder={el.placeholder}
                          value={parts[key]}
                          onChange={(e) => setParts((p) => ({ ...p, [key]: e.target.value }))}
                        />
                      </div>
                    )
                  })}
                  <Button onClick={insert} disabled={!combined.trim()} fullWidth>
                    <ClipboardPaste className="h-4 w-4" /> Insert into answer
                  </Button>
                  {combined && (
                    <p className="rounded-xl bg-ink-50 p-3 text-xs leading-relaxed text-ink-500">
                      Preview: “{combined}”
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-ink-100 px-5 py-3">
              <p className="flex items-center gap-1.5 text-xs text-ink-500">
                <Star className="h-3.5 w-3.5 text-sunrise-500" aria-hidden="true" />
                Shown automatically for behavioral questions.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default StarHelper
