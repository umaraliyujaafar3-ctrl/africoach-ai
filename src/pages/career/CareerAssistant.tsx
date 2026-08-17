import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Briefcase,
  ClipboardPen,
  FileText,
  Lightbulb,
  Send,
  Sparkles,
  Target,
  UploadCloud,
  UserRound,
} from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/store/auth'
import { toast } from '@/store/toast'

interface ChatMessage {
  id: string
  role: 'ai' | 'user'
  text: string
}

type ActionId = 'cv' | 'cover-letter' | 'advice' | 'skills' | 'interview'

const quickActions: { id: ActionId; label: string; icon: typeof FileText }[] = [
  { id: 'cv', label: 'Improve my CV', icon: FileText },
  { id: 'cover-letter', label: 'Write a cover letter', icon: ClipboardPen },
  { id: 'advice', label: 'Career advice', icon: Lightbulb },
  { id: 'skills', label: 'Skills for this role', icon: Target },
  { id: 'interview', label: 'Interview strategies', icon: Briefcase },
]

const replies: Record<ActionId, string> = {
  cv: "I'd love to polish your CV. Upload it here and I'll review your structure, achievements and keywords — then suggest edits in plain language. While I look, tell me: what role are you targeting, and what's your strongest accomplishment?",
  'cover-letter':
    "Let's write a cover letter that gets read. Tell me the role you're applying for and one thing about the company that excites you. I'll draft an opening that hooks the reader, 2-3 punchy middle paragraphs, and a confident close.",
  advice:
    "Happy to talk it through! Tell me a bit about where you are in your career right now — are you looking for a first role, switching fields, or leveling up? I'll give you a short plan with concrete next steps you can start this week.",
  skills:
    'What role are you targeting? Share the job title (or a job description) and I\'ll list the top skills employers ask for, split into hard and soft skills — plus a quick way to showcase each one on your CV.',
  interview:
    "Let's get you interview-ready. My top advice: always answer behavioral questions with the STAR method, keep intro answers under 90 seconds, and prepare 3 questions to ask at the end. Which part do you want to drill into first?",
}

const GREETING =
  "Hi, I'm Ada — your career coach. I can help you sharpen your CV, draft cover letters, map out skills, or prep for interviews. What would you like to work on?"

let msgCounter = 0
const nextId = () => `m-${++msgCounter}`

export default function CareerAssistant() {
  const user = useAuthStore((s) => s.user)
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: nextId(), role: 'ai', text: GREETING }])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [activeAction, setActiveAction] = useState<ActionId | null>(null)
  const [cvFile, setCvFile] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  const pushAi = (text: string) => {
    setThinking(true)
    setTimeout(() => {
      setMessages((m) => [...m, { id: nextId(), role: 'ai', text }])
      setThinking(false)
    }, 900)
  }

  const selectAction = (id: ActionId) => {
    setActiveAction(id)
    pushAi(replies[id])
  }

  const send = (text: string) => {
    if (!text.trim() || thinking) return
    setMessages((m) => [...m, { id: nextId(), role: 'user', text: text.trim() }])
    setInput('')
    pushAi(
      activeAction === 'cv' && !cvFile
        ? 'Got it — a note is saved. Whenever you\'re ready, upload your CV above and I\'ll dive in with specific feedback.'
        : 'Noted! I\'m thinking this through from an African hiring perspective. I\'ll have tailored suggestions for you in a moment — feel free to tell me more about the role in the meantime.',
    )
  }

  const handleCvUpload = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setCvFile(file.name)
    toast('CV uploaded — I\'m reviewing it now')
    setMessages((m) => [...m, { id: nextId(), role: 'user', text: `Uploaded ${file.name}` }])
    pushAi(
      "Great, I've received your CV. Here's my quick read: keep your summary to 2 lines with a measurable win, use strong action verbs, and tailor the top third to the specific job. Want me to walk through each section in detail?",
    )
  }

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <aside className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickActions.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => selectAction(a.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-medium transition-colors',
                activeAction === a.id ? 'border-sunrise-300 bg-sunrise-50 text-sunrise-700' : 'text-ink-600 hover:bg-ink-50',
              )}
            >
              <a.icon className="h-4 w-4" aria-hidden="true" /> {a.label}
            </button>
          ))}
        </div>
      </aside>

      <aside className="hidden lg:block">
        <Card className="sticky top-20">
          <div className="border-b border-ink-100 px-4 py-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
              <Sparkles className="h-4 w-4 text-sunrise-500" aria-hidden="true" /> Quick actions
            </p>
          </div>
          <ul className="p-2">
            {quickActions.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => selectAction(a.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    activeAction === a.id ? 'bg-sunrise-50 text-sunrise-700' : 'text-ink-600 hover:bg-ink-50',
                  )}
                >
                  <a.icon className="h-4 w-4 shrink-0" aria-hidden="true" /> {a.label}
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </aside>

      <Card className="flex h-[calc(100vh-13rem)] flex-col overflow-hidden lg:h-[calc(100vh-9rem)]">
        <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-3.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sunrise-400 to-sunrise-600 text-white">
            <UserRound className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink-900">Ada · Career Coach</p>
            <p className="text-xs text-emerald-600">Online · replies instantly</p>
          </div>
          <span className="ml-auto hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:block">
            Free plan · always on
          </span>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn('flex items-start gap-3', m.role === 'user' && 'flex-row-reverse')}
            >
              {m.role === 'ai' && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sunrise-400 to-sunrise-600 text-white">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  m.role === 'ai' ? 'rounded-tl-sm bg-sunrise-50/70 text-ink-800' : 'rounded-tr-sm bg-ink-900 text-white',
                )}
              >
                {m.text}
              </div>
            </motion.div>
          ))}

          {activeAction === 'cv' && !cvFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ml-12 max-w-md"
            >
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload CV"
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-sunrise-200 bg-sunrise-50/50 px-6 py-6 text-center transition-colors hover:border-sunrise-400"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  onChange={(e) => handleCvUpload(e.target.files)}
                />
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sunrise-600 shadow-soft">
                  <UploadCloud className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink-900">Upload your CV here</p>
                <p className="mt-1 text-xs text-ink-500">PDF or DOCX · max 5MB</p>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {thinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-12 flex w-fit items-center gap-1 rounded-full bg-sunrise-50/70 px-4 py-3"
                aria-label="Ada is typing"
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-sunrise-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-ink-100 p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input)}
              placeholder={`Ask Ada anything, ${firstName}…`}
              aria-label="Message Ada"
              className="h-11 flex-1 rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 placeholder:text-ink-500 focus:border-sunrise-500 focus:outline-none focus:ring-2 focus:ring-sunrise-500/30"
            />
            <Button
              onClick={() => send(input)}
              disabled={!input.trim() || thinking}
              aria-label="Send message"
              className="h-11 w-11 shrink-0 px-0"
            >
              <Send className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-ink-500">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Ada may make mistakes — double-check important advice.
          </p>
        </div>
      </Card>
    </div>
  )
}
