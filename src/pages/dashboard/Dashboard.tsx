import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Mic2, PlayCircle, Sparkles, TrendingUp, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { useFeedbackStore } from '@/store/feedback'
import { useInterviewStore } from '@/store/interview'
import { useUiStore } from '@/store/ui'
import { Badge, Button, Card, CardContent, Skeleton } from '@/components/ui'
import { useDelayedLoading } from '@/lib/useDelayedLoading'
import { cn } from '@/lib/cn'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const reports = useFeedbackStore((s) => s.reports)
  const seedDemoData = useFeedbackStore((s) => s.seedDemoData)
  const interview = useInterviewStore()
  const loading = useDelayedLoading()
  const tourDismissed = useUiStore((s) => s.tourDismissed)
  const dismissTour = useUiStore((s) => s.dismissTour)

  useEffect(() => {
    seedDemoData()
  }, [seedDemoData])

  const sortedDesc = useMemo(() => [...reports].sort((a, b) => b.date.localeCompare(a.date)), [reports])
  const sortedAsc = useMemo(() => [...reports].sort((a, b) => a.date.localeCompare(b.date)), [reports])
  const latest = sortedDesc[0]

  const avgScore = (dimId: string) => {
    const vals = sortedDesc
      .map((r) => r.dimensions.find((d) => d.id === dimId)?.score)
      .filter((v): v is number => v !== undefined)
    if (!vals.length) return 0
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }

  const streak = useMemo(() => {
    if (!sortedDesc.length) return 0
    const days = sortedDesc.map((r) => new Date(r.date).toDateString())
    const unique = [...new Set(days)]
    let count = 1
    for (let i = 1; i < unique.length; i++) {
      const prev = new Date(unique[i - 1]).getTime()
      const curr = new Date(unique[i]).getTime()
      if (prev - curr <= 2 * 24 * 60 * 60 * 1000) count++
      else break
    }
    return count
  }, [sortedDesc])

  const chartData = sortedAsc.map((r) => ({ label: formatDate(r.date), score: r.overallScore }))

  const strongAreas = latest?.dimensions.filter((d) => d.score >= 70).map((d) => d.label) ?? []
  const weakAreas = latest?.dimensions.filter((d) => d.score < 62).map((d) => d.label) ?? []

  const hasInProgress =
    interview.sessionId !== null && interview.questions.length > 0 && interview.startedAt !== null

  const firstName = user?.name?.split(' ')[0] ?? 'Champion'
  const motivational = latest
    ? latest.overallScore >= 70
      ? 'You\u2019re trending up. Keep the momentum going!'
      : 'Every session makes you sharper. Let\u2019s go again.'
    : 'Let\u2019s get you to your first practice interview.'

  const stats = [
    { label: 'Interviews Completed', value: String(reports.length), icon: Mic2, tone: 'bg-sunrise-50 text-sunrise-600' },
    { label: 'Avg Confidence Score', value: `${avgScore('confidence')}/100`, icon: Sparkles, tone: 'bg-sky-50 text-sky-600' },
    { label: 'Avg Communication Score', value: `${avgScore('communication')}/100`, icon: TrendingUp, tone: 'bg-teal-50 text-teal-600' },
    { label: 'Current Streak', value: `${streak} ${streak === 1 ? 'day' : 'days'}`, icon: Flame, tone: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-950">Welcome back, {firstName}</h2>
          <p className="mt-1 text-sm text-ink-500">{motivational}</p>
        </div>
        <Button size="lg" onClick={() => navigate('/interview/setup')}>
          <Mic2 className="h-4 w-4" /> Start New Interview
        </Button>
      </motion.div>

      {!tourDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-3 rounded-2xl border border-sunrise-200 bg-sunrise-50/70 p-4 sm:flex-row sm:items-center"
          role="note"
          aria-label="Getting started"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sunrise-500 text-white">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink-900">Welcome to your coaching hub</p>
            <p className="mt-0.5 text-sm text-ink-500">
              Take a practice interview to unlock your score trend, feedback reports and streak. Start with the blue button above.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate('/interview/setup')}>
            Try a practice interview
          </Button>
          <button
            type="button"
            onClick={dismissTour}
            aria-label="Dismiss getting started tip"
            className="rounded-lg p-1.5 text-ink-500 transition-colors hover:bg-sunrise-100 hover:text-ink-900"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))
          : stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hoverable>
                  <CardContent className="flex items-center gap-3">
                <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', s.tone)}>
                  <s.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-xl font-bold leading-none text-ink-950">{s.value}</p>
                  <p className="mt-1 truncate text-xs text-ink-500">{s.label}</p>
                </div>
              </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>

      {hasInProgress && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-sunrise-200 bg-gradient-to-r from-sunrise-50 to-white">
            <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunrise-500 text-white">
                  <PlayCircle className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">Continue where you left off</p>
                  <p className="mt-0.5 text-sm text-ink-500">
                    You're on question {interview.currentIndex + 1} of {interview.questions.length}.
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate('/interview/session')}>
                Resume Interview <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-ink-900">Progress over time</h3>
                <Badge tone="success">Improving</Badge>
              </div>
              {loading ? (
                <Skeleton className="h-56 w-full sm:h-64" />
              ) : chartData.length ? (
                <div className="h-56 w-full sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF6B1F" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#FF6B1F" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF2" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#8098AB' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#8098AB' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value) => [`${value}/100`, 'Score']}
                        contentStyle={{ borderRadius: 12, border: '1px solid #E8ECF2', fontSize: 13 }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#FF6B1F" strokeWidth={2.5} fill="url(#scoreGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex h-56 items-center justify-center text-center">
                  <p className="text-sm text-ink-500">No sessions yet — your score trend will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full">
            <CardContent>
              <h3 className="text-base font-semibold text-ink-900">Strong & weak areas</h3>
              <p className="mt-1 text-xs text-ink-500">From your latest session</p>
              {latest ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-600">Strong</p>
                    <div className="flex flex-wrap gap-1.5">
                      {strongAreas.length ? (
                        strongAreas.map((a) => (
                          <Badge key={a} tone="success">{a}</Badge>
                        ))
                      ) : (
                        <p className="text-xs text-ink-500">Nothing at 70+ yet — keep practising.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">To improve</p>
                    <div className="flex flex-wrap gap-1.5">
                      {weakAreas.length ? (
                        weakAreas.map((a) => (
                          <Badge key={a} tone="warning">{a}</Badge>
                        ))
                      ) : (
                        <p className="text-xs text-ink-500">Looking strong across the board!</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-ink-500">
                  Complete an interview to see your areas breakdown.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="border-b border-ink-100 px-5 py-4">
            <h3 className="text-base font-semibold text-ink-900">Recent interviews</h3>
          </div>
          {loading ? (
            <div className="space-y-3 px-5 py-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/5" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : sortedDesc.length ? (
            <ul className="divide-y divide-ink-100">
              {sortedDesc.slice(0, 5).map((r) => (
                <li key={r.sessionId} className="flex items-center gap-4 px-5 py-3.5">
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
                      r.overallScore >= 70
                        ? 'bg-teal-50 text-teal-600'
                        : r.overallScore >= 55
                          ? 'bg-sunrise-50 text-sunrise-600'
                          : 'bg-red-50 text-red-600',
                    )}
                  >
                    {r.overallScore}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {r.interviewType} · {r.jobRole || 'General'}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-500">{formatDate(r.date)}</p>
                  </div>
                  <Link
                    to={`/interview/feedback/${r.sessionId}`}
                    className="text-sm font-medium text-sunrise-600 hover:underline"
                  >
                    View feedback
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center px-5 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunrise-50 text-sunrise-600">
                <Mic2 className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold text-ink-900">No interviews yet</p>
              <p className="mt-1 max-w-xs text-sm text-ink-500">
                Your first practice session is one click away.
              </p>
              <Button className="mt-5" onClick={() => navigate('/interview/setup')}>
                Start your first interview <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
