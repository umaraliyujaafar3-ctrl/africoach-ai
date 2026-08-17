import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  LayoutDashboard,
  Lightbulb,
  RefreshCcw,
  RotateCcw,
  TrendingUp,
} from 'lucide-react'
import { useInterviewStore } from '@/store/interview'
import { useFeedbackStore } from '@/store/feedback'
import generateFeedback from '@/lib/feedbackService'
import { Button, Card, CardContent, ProgressBar, Spinner } from '@/components/ui'
import type { FeedbackReport } from '@/types/feedback'
import { cn } from '@/lib/cn'

function headline(score: number) {
  if (score >= 85) return 'Outstanding! You absolutely nailed this one.'
  if (score >= 70) return 'Great job — you\u2019re clearly interview-ready.'
  if (score >= 55) return 'Solid effort. A few tweaks and you\u2019ll fly.'
  return 'Good start. Every practice round builds your confidence.'
}

function scoreTone(score: number) {
  if (score >= 70) return 'text-emerald-600'
  if (score >= 55) return 'text-sunrise-600'
  return 'text-red-600'
}

export default function Feedback() {
  const { sessionId = '' } = useParams()
  const navigate = useNavigate()
  const interview = useInterviewStore()
  const feedback = useFeedbackStore()
  const [report, setReport] = useState<FeedbackReport | null>(() => feedback.getReport(sessionId) ?? null)
  const [loading, setLoading] = useState(() => report === null)
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current || report) return
    fetched.current = true
    const build = async () => {
      const r = await generateFeedback({
        sessionId,
        interviewType: interview.setup.interviewType ?? 'HR',
        jobRole: interview.setup.jobRole,
        questions: interview.questions,
        answers: interview.answers,
        startedAt: interview.startedAt,
      })
      feedback.addReport(r)
      setReport(r)
      setLoading(false)
    }
    void build()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-ink-100 bg-white py-24 shadow-soft">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-ink-500">Scoring your interview…</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-10 text-center shadow-soft">
        <h2 className="font-display text-xl font-bold text-ink-900">Feedback not found</h2>
        <Link to="/interview/setup">
          <Button className="mt-6">Start a new interview</Button>
        </Link>
      </div>
    )
  }

  const sortedQuestions = [...report.questions].sort((a, b) => a.score - b.score)

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft"
      >
        <div className="bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 px-6 py-8 text-center sm:px-10">
          <p className="text-sm font-medium text-ink-300">
            {report.interviewType} Interview · {report.jobRole || 'General'}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white">{headline(report.overallScore)}</h1>

          <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-8">
            <div className="relative h-32 w-32">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - report.overallScore / 100) }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF8B47" />
                    <stop offset="100%" stopColor="#FF6B1F" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-extrabold text-white">
                  {report.overallScore}
                </span>
                <span className="text-xs text-ink-300">/ 100</span>
              </div>
            </div>
            <div className="text-left">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <TrendingUp className="h-4 w-4" aria-hidden="true" /> Overall score
              </p>
              <p className="mt-2 text-sm text-ink-300">
                Across {report.questions.length} questions in {Math.max(1, Math.round(report.durationSec / 60))} min.
              </p>
            </div>
          </div>
        </div>

        <CardContent className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-4 text-sm font-semibold text-ink-900">Score breakdown</h2>
            <ul className="space-y-3.5">
              {report.dimensions.map((d) => (
                <li key={d.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-ink-600">{d.label}</span>
                    <span className={cn('font-semibold tabular-nums', scoreTone(d.score))}>{d.score}</span>
                  </div>
                  <ProgressBar
                    value={d.score}
                    ariaLabel={`${d.label} score`}
                    tone={d.score >= 70 ? 'success' : d.score >= 55 ? 'warning' : 'danger'}
                    className="h-1.5"
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <ArrowUp className="h-4 w-4" aria-hidden="true" /> Strengths
              </p>
              <ul className="mt-3 space-y-2">
                {report.strengths.map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-ink-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                <ArrowDown className="h-4 w-4" aria-hidden="true" /> Areas to improve
              </p>
              <ul className="mt-3 space-y-2">
                {report.areasToImprove.map((a) => (
                  <li key={a} className="flex gap-2 text-sm text-ink-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">Per-question breakdown</h2>
          <span className="text-xs text-ink-500">Sorted by lowest score</span>
        </div>
        <div className="space-y-3">
          {sortedQuestions.map((q, i) => {
            const open = openQuestion === q.questionId
            return (
              <Card key={q.questionId} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenQuestion(open ? null : q.questionId)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-ink-50/60"
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                      q.score >= 70 ? 'bg-emerald-50 text-emerald-600' : q.score >= 55 ? 'bg-sunrise-50 text-sunrise-600' : 'bg-red-50 text-red-600',
                    )}
                  >
                    {q.score}
                  </span>
                  <span className="flex-1">
                    <span className="text-xs text-ink-500">Question {i + 1}</span>
                    <span className="mt-0.5 block text-sm font-medium leading-snug text-ink-800">
                      {q.question}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn('h-5 w-5 shrink-0 text-ink-500 transition-transform', open && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-ink-100"
                    >
                      <div className="space-y-4 p-4 sm:p-5">
                        <div>
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">Your answer</p>
                          <p className="rounded-xl bg-ink-50 p-3 text-sm leading-relaxed text-ink-700">
                            {q.answer || 'You skipped this question.'}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sunrise-50 text-sunrise-600">
                            <Lightbulb className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div>
                            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">AI feedback</p>
                            <p className="text-sm leading-relaxed text-ink-700">{q.feedback}</p>
                            <ul className="mt-2 space-y-1.5">
                              {q.tips.map((tip) => (
                                <li key={tip} className="flex gap-2 text-sm text-ink-600">
                                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sunrise-500" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col justify-center gap-3 sm:flex-row"
      >
        <Button onClick={() => navigate('/interview/session')}>
          <RotateCcw className="h-4 w-4" /> Practice Again
        </Button>
        <Button variant="secondary" onClick={() => navigate('/interview/setup')}>
          <RefreshCcw className="h-4 w-4" /> Try a Different Interview Type
        </Button>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <LayoutDashboard className="h-4 w-4" /> Back to Dashboard
        </Button>
      </motion.section>
    </div>
  )
}
