import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, History as HistoryIcon, Mic2, Search } from 'lucide-react'
import { useFeedbackStore } from '@/store/feedback'
import { Badge, Button, Card, Select, Skeleton } from '@/components/ui'
import { useDelayedLoading } from '@/lib/useDelayedLoading'
import { cn } from '@/lib/cn'
import { INTERVIEW_TYPES } from '@/types'
import type { FeedbackReport } from '@/types/feedback'

const PAGE_SIZE = 8
const NOW = Date.now()

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDuration(sec: number) {
  const m = Math.max(1, Math.round(sec / 60))
  return `${m} min`
}

function scoreTone(score: number) {
  if (score >= 70) return 'bg-teal-50 text-teal-600'
  if (score >= 55) return 'bg-sunrise-50 text-sunrise-600'
  return 'bg-red-50 text-red-600'
}

type DateRange = 'all' | '7' | '30' | '90'
type ScoreRange = 'all' | 'lt50' | '50-69' | '70-84' | 'gte85'
type SortKey = 'newest' | 'oldest' | 'score'

export default function History() {
  const navigate = useNavigate()
  const reports = useFeedbackStore((s) => s.reports)
  const seedDemoData = useFeedbackStore((s) => s.seedDemoData)
  const loading = useDelayedLoading()

  useEffect(() => {
    seedDemoData()
  }, [seedDemoData])

  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [dateRange, setDateRange] = useState<DateRange>('all')
  const [scoreRange, setScoreRange] = useState<ScoreRange>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = reports.filter((r) => {
      if (type !== 'all' && r.interviewType !== type) return false
      if (dateRange !== 'all' && NOW - new Date(r.date).getTime() > Number(dateRange) * 24 * 60 * 60 * 1000) return false
      if (scoreRange === 'lt50' && r.overallScore >= 50) return false
      if (scoreRange === '50-69' && (r.overallScore < 50 || r.overallScore >= 70)) return false
      if (scoreRange === '70-84' && (r.overallScore < 70 || r.overallScore >= 85)) return false
      if (scoreRange === 'gte85' && r.overallScore < 85) return false
      if (search && !(r.jobRole + r.interviewType).toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === 'oldest') return a.date.localeCompare(b.date)
      if (sort === 'score') return b.overallScore - a.overallScore
      return b.date.localeCompare(a.date)
    })
    return list
  }, [reports, type, dateRange, scoreRange, search, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const resetFilters = () => {
    setSearch('')
    setType('all')
    setDateRange('all')
    setScoreRange('all')
    setSort('newest')
    setPage(1)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-950">Interview history</h2>
          <p className="mt-1 text-sm text-ink-500">
            Review every practice session and keep climbing your scores.
          </p>
        </div>
        <Button onClick={() => navigate('/interview/setup')}>
          <Mic2 className="h-4 w-4" /> New Interview
        </Button>
      </div>

      <Card>
        <div className="grid gap-3 border-b border-ink-100 p-4 md:grid-cols-[1fr_repeat(3,minmax(0,1fr))]">
          <div className="relative md:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by role or type…"
              aria-label="Search history"
              className="h-10 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-3.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-sunrise-500 focus:outline-none focus:ring-2 focus:ring-sunrise-500/30"
            />
          </div>
          <Select value={type} onChange={(e) => { setType(e.target.value); setPage(1) }} aria-label="Filter by type">
            <option value="all">All types</option>
            {INTERVIEW_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Select value={dateRange} onChange={(e) => { setDateRange(e.target.value as DateRange); setPage(1) }} aria-label="Filter by date range">
            <option value="all">Any time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </Select>
          <Select value={scoreRange} onChange={(e) => { setScoreRange(e.target.value as ScoreRange); setPage(1) }} aria-label="Filter by score range">
            <option value="all">Any score</option>
            <option value="lt50">Under 50</option>
            <option value="50-69">50 – 69</option>
            <option value="70-84">70 – 84</option>
            <option value="gte85">85+</option>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-1 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-5 px-1 py-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-14" />
                <Skeleton className="ml-auto h-8 w-11 rounded-lg" />
              </div>
            ))}
          </div>
        ) : paged.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wide text-ink-500">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Score</th>
                  <th className="px-5 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r: FeedbackReport) => (
                  <tr
                    key={r.sessionId}
                    onClick={() => navigate(`/interview/feedback/${r.sessionId}`)}
                    className="cursor-pointer border-b border-ink-50 transition-colors last:border-0 hover:bg-sunrise-50/40"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-ink-600">{formatDate(r.date)}</td>
                    <td className="px-5 py-3.5">
                      <Badge tone="neutral">{r.interviewType}</Badge>
                    </td>
                    <td className="max-w-[180px] truncate px-5 py-3.5 text-sm font-medium text-ink-800">
                      {r.jobRole || 'General'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-sm text-ink-500">{formatDuration(r.durationSec)}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('inline-flex h-8 w-11 items-center justify-center rounded-lg text-sm font-bold', scoreTone(r.overallScore))}>
                        {r.overallScore}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/interview/feedback/${r.sessionId}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View feedback for ${r.interviewType} interview`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-sunrise-600 hover:underline"
                      >
                        Details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-5 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-50 text-ink-500">
              <HistoryIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-semibold text-ink-900">No sessions match your filters</p>
            <p className="mt-1 max-w-xs text-sm text-ink-500">
              {reports.length ? 'Try clearing a filter to see more results.' : 'Complete your first interview and it will show up here.'}
            </p>
            <Button variant="ghost" className="mt-5" onClick={resetFilters}>
              Clear all filters
            </Button>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-100 px-5 py-3 sm:flex-row">
            <p className="text-xs text-ink-500">
              Showing {Math.min(filtered.length, (safePage - 1) * PAGE_SIZE + paged.length)} of {filtered.length} sessions
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i + 1)}
                  aria-label={`Page ${i + 1}`}
                  aria-current={safePage === i + 1 ? 'page' : undefined}
                  className={cn(
                    'h-8 w-8 rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50',
                    safePage === i + 1 ? 'bg-sunrise-500 text-white' : 'text-ink-500 hover:bg-ink-50',
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={safePage >= pageCount}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-50 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
