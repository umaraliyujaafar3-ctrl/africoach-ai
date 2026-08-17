import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DifficultyLevel, InterviewMode, Language } from '@/types'

export interface Notifications {
  email: boolean
  push: boolean
  tips: boolean
  weeklyReport: boolean
}

export type Plan = 'Free' | 'Pro'

interface SettingsState {
  defaultMode: InterviewMode
  language: Language
  difficulty: DifficultyLevel
  notifications: Notifications
  plan: Plan
  interviewsUsedThisMonth: number
  setDefaultMode: (mode: InterviewMode) => void
  setLanguage: (lang: Language) => void
  setDifficulty: (level: DifficultyLevel) => void
  setNotification: (key: keyof Notifications, value: boolean) => void
  setPlan: (plan: Plan) => void
  useInterview: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultMode: 'text',
      language: 'English',
      difficulty: 'Beginner',
      notifications: {
        email: true,
        push: false,
        tips: true,
        weeklyReport: false,
      },
      plan: 'Free',
      interviewsUsedThisMonth: 3,
      setDefaultMode: (defaultMode) => set({ defaultMode }),
      setLanguage: (language) => set({ language }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setNotification: (key, value) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: value } })),
      setPlan: (plan) => set({ plan }),
      useInterview: () =>
        set((s) => ({ interviewsUsedThisMonth: Math.min(5, s.interviewsUsedThisMonth + 1) })),
    }),
    { name: 'africoach-settings' },
  ),
)

export default useSettingsStore
