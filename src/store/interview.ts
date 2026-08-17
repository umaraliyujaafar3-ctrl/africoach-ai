import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  DifficultyLevel,
  ExperienceLevel,
  InterviewMode,
  InterviewType,
  Language,
} from '@/types'

export interface InterviewQuestion {
  id: string
  type: 'hr' | 'behavioral' | 'technical' | 'internship' | 'scholarship' | 'graduate-trainee'
  category: InterviewType
  question: string
  starTagged?: boolean
}

export interface InterviewSetup {
  interviewType: InterviewType | null
  jobRole: string
  experienceLevel: ExperienceLevel | null
  difficulty: DifficultyLevel
  mode: InterviewMode
  language: Language
  jobDescription: string
}

export interface InterviewAnswer {
  questionId: string
  answer: string
}

export interface InterviewState {
  setup: InterviewSetup
  sessionId: string | null
  questions: InterviewQuestion[]
  currentIndex: number
  answers: InterviewAnswer[]
  startedAt: number | null
  mode: InterviewMode
  isThinking: boolean
  setSetup: (patch: Partial<InterviewSetup>) => void
  startInterview: (questions: InterviewQuestion[]) => void
  advance: () => void
  setAnswer: (questionId: string, answer: string) => void
  updateMode: (mode: InterviewMode) => void
  setThinking: (thinking: boolean) => void
  resetSession: () => void
}

const initialSetup: InterviewSetup = {
  interviewType: null,
  jobRole: '',
  experienceLevel: null,
  difficulty: 'Beginner',
  mode: 'text',
  language: 'English',
  jobDescription: '',
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      setup: initialSetup,
      sessionId: null,
      questions: [],
      currentIndex: 0,
      answers: [],
      startedAt: null,
      mode: 'text',
      isThinking: false,
      setSetup: (patch) => set((s) => ({ setup: { ...s.setup, ...patch } })),
      startInterview: (questions) =>
        set((s) => ({
          questions,
          sessionId: crypto.randomUUID(),
          currentIndex: 0,
          answers: [],
          startedAt: Date.now(),
          mode: s.setup.mode,
          isThinking: false,
        })),
      advance: () => set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, s.questions.length - 1) })),
      setAnswer: (questionId, answer) =>
        set((s) => {
          const existing = s.answers.findIndex((a) => a.questionId === questionId)
          if (existing >= 0) {
            const answers = [...s.answers]
            answers[existing] = { questionId, answer }
            return { answers }
          }
          return { answers: [...s.answers, { questionId, answer }] }
        }),
      updateMode: (mode) => set({ mode }),
      setThinking: (isThinking) => set({ isThinking }),
      resetSession: () =>
        set({
          sessionId: null,
          questions: [],
          currentIndex: 0,
          answers: [],
          startedAt: null,
          isThinking: false,
        }),
    }),
    { name: 'africoach-interview', partialize: (s) => ({ setup: s.setup }) },
  ),
)

export default useInterviewStore
