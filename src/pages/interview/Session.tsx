import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Mic, Send, Sparkles, Square, Timer, Volume2 } from 'lucide-react'
import { useInterviewStore, type InterviewQuestion } from '@/store/interview'
import getInterviewQuestions from '@/lib/interviewService'
import VoiceMode from '@/pages/interview/components/VoiceMode'
import StarHelper from '@/pages/interview/components/StarHelper'
import { Button, Modal } from '@/components/ui'
import { cn } from '@/lib/cn'

interface Message {
  id: string
  role: 'ai' | 'user'
  text: string
}

const INTRO = (type: string, role: string) =>
  `Hello! I'm your AfriCoach interviewer for a ${type} interview${role ? ` for the ${role} role` : ''}. I'll ask you a few questions one at a time — take your time and answer as you would in a real interview. Let's begin!`

export default function InterviewSession() {
  const navigate = useNavigate()
  const store = useInterviewStore()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [confirmEnd, setConfirmEnd] = useState(false)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [starOpen, setStarOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  const questions = store.questions
  const total = questions.length
  const currentQuestion = questions[store.currentIndex]
  const isBehavioral = currentQuestion?.starTagged || currentQuestion?.type === 'behavioral'

  useEffect(() => {
    if (started.current) return
    started.current = true
    const boot = async () => {
      if (!store.sessionId) {
        const qs = await getInterviewQuestions(store.setup)
        store.startInterview(qs)
        setMessages([{ id: 'intro', role: 'ai', text: INTRO(store.setup.interviewType ?? 'mock', store.setup.jobRole) }])
        setTimeout(() => {
          setMessages((m) => [...m, { id: qs[0].id, role: 'ai', text: qs[0].question }])
        }, 400)
      } else {
        const answered = store.answers
        const msgs: Message[] = [
          { id: 'intro', role: 'ai', text: INTRO(store.setup.interviewType ?? 'mock', store.setup.jobRole) },
        ]
        answered.forEach((a, i) => {
          const q = questions[i]
          if (q) msgs.push({ id: q.id, role: 'ai', text: q.question })
          msgs.push({ id: `${q?.id}-a`, role: 'user', text: a.answer })
        })
        const current = questions[answered.length]
        if (current) msgs.push({ id: current.id, role: 'ai', text: current.question })
        setMessages(msgs)
      }
    }
    void boot()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!store.startedAt) return
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - (store.startedAt ?? 0)) / 1000)), 1000)
    return () => clearInterval(t)
  }, [store.startedAt])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, store.isThinking])

  const pushQuestion = useCallback(
    (q: InterviewQuestion) => {
      store.setThinking(true)
      setTimeout(() => {
        setMessages((m) => [...m, { id: q.id, role: 'ai', text: q.question }])
        store.advance()
        store.setThinking(false)
        if (store.mode === 'voice') {
          setAiSpeaking(true)
          setTimeout(() => setAiSpeaking(false), 2200)
        }
      }, 900)
    },
    [store],
  )

  const sendAnswer = useCallback(
    (text: string) => {
      if (!text.trim() || !currentQuestion) return
      const trimmed = text.trim()
      setMessages((m) => [...m, { id: `${currentQuestion.id}-a-${Date.now()}`, role: 'user', text: trimmed }])
      store.setAnswer(currentQuestion.id, trimmed)
      setInput('')
      const next = questions[store.currentIndex + 1]
      if (next) {
        pushQuestion(next)
      } else {
        store.setThinking(true)
        setTimeout(() => {
          store.setThinking(false)
          navigate(`/interview/feedback/${store.sessionId}`, { replace: true })
        }, 1200)
      }
    },
    [currentQuestion, questions, store, navigate, pushQuestion],
  )

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const ss = s % 60
    return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
  }

  return (
    <div className="relative flex h-[calc(100vh-8.5rem)] flex-col rounded-2xl border border-ink-100 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink-500">
            Question {Math.min(store.currentIndex + 1, total)} of {total}
          </span>
          <span className="inline-block h-2 w-28 overflow-hidden rounded-full bg-ink-100">
            <span
              className="block h-full rounded-full bg-sunrise-500 transition-all duration-500"
              style={{ width: `${total ? (Math.min(store.currentIndex + 1, total) / total) * 100 : 0}%` }}
            />
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium tabular-nums text-ink-500">
            <Timer className="h-4 w-4" aria-hidden="true" /> {formatTime(elapsed)}
          </span>
          <Button variant="danger" size="sm" onClick={() => setConfirmEnd(true)}>
            <Square className="h-3.5 w-3.5" /> End Interview
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={cn('flex items-start gap-3', m.role === 'user' && 'flex-row-reverse')}
          >
            {m.role === 'ai' ? (
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sunrise-500 text-white">
                <Bot className="h-5 w-5" aria-hidden="true" />
                {aiSpeaking && (
                  <span
                    className="absolute -bottom-1 -right-1 flex h-4 w-4 items-end justify-center gap-[2px] rounded-full bg-ink-900 p-[3px]"
                    aria-label="AI speaking"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-[2px] rounded-full bg-white"
                        animate={{ height: ['2px', '8px', '2px'] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </span>
                )}
              </span>
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white">
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
            <div
              className={cn(
                'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                m.role === 'ai'
                  ? 'rounded-tl-sm bg-ink-50 text-ink-800'
                  : 'rounded-tr-sm bg-sunrise-500 text-white',
              )}
            >
              {m.text}
            </div>
          </motion.div>
        ))}

        <AnimatePresence>
          {store.isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
              aria-label="AI is thinking"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sunrise-500 text-white">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex gap-1 rounded-full bg-ink-50 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-ink-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-ink-100 p-3 sm:p-4">
        {isBehavioral && (
          <div className="mb-3 flex justify-center">
            <Button variant="ghost" size="sm" onClick={() => setStarOpen(true)}>
              <Sparkles className="h-4 w-4 text-sunrise-500" aria-hidden="true" />
              Need help structuring your answer?
            </Button>
          </div>
        )}
        {store.mode === 'text' ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => store.updateMode('voice')}
              aria-label="Switch to voice mode"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-white transition-colors hover:bg-ink-800"
            >
              <Mic className="h-5 w-5" aria-hidden="true" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendAnswer(input)}
              placeholder="Type your answer…"
              aria-label="Type your answer"
              className="h-11 flex-1 rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-900 placeholder:text-ink-500 focus:border-sunrise-500 focus:outline-none focus:ring-2 focus:ring-sunrise-500/30"
            />
            <Button
              onClick={() => sendAnswer(input)}
              disabled={!input.trim()}
              aria-label="Send answer"
              className="h-11 w-11 shrink-0 px-0"
            >
              <Send className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          <VoiceMode
            isThinking={store.isThinking}
            onSendAnswer={sendAnswer}
            onSwitchToText={() => store.updateMode('text')}
          />
        )}
      </div>

      <Modal
        open={confirmEnd}
        onClose={() => setConfirmEnd(false)}
        title="End this interview?"
        description="You'll get your feedback report once you end the session."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmEnd(false)}>
              Keep practicing
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirmEnd(false)
                navigate(`/interview/feedback/${store.sessionId}`, { replace: true })
              }}
            >
              End interview
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-500">
          You've answered {store.answers.length} of {total} questions. Your progress will be saved.
        </p>
      </Modal>

      <StarHelper
        open={starOpen}
        onClose={() => setStarOpen(false)}
        onInsert={(text) => {
          store.updateMode('text')
          setInput(text)
        }}
      />
    </div>
  )
}
