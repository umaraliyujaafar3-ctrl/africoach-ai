import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FeedbackReport } from '@/types/feedback'
import { MOCK_REPORTS } from '@/lib/demoData'

interface FeedbackState {
  reports: FeedbackReport[]
  seeded: boolean
  addReport: (report: FeedbackReport) => void
  getReport: (sessionId: string) => FeedbackReport | undefined
  seedDemoData: () => void
  resetReports: () => void
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      reports: [],
      seeded: false,
      addReport: (report) =>
        set((s) => ({
          reports: s.reports.some((r) => r.sessionId === report.sessionId)
            ? s.reports.map((r) => (r.sessionId === report.sessionId ? report : r))
            : [report, ...s.reports],
        })),
      getReport: (sessionId) => get().reports.find((r) => r.sessionId === sessionId),
      seedDemoData: () => {
        if (get().seeded) return
        set((s) => ({
          seeded: true,
          reports: [...s.reports, ...MOCK_REPORTS],
        }))
      },
      resetReports: () => set({ reports: [], seeded: false }),
    }),
    { name: 'africoach-feedback' },
  ),
)

export default useFeedbackStore
