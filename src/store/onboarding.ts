import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CareerField, ExperienceLevel, InterviewMode, Language } from '@/types'

export interface OnboardingState {
  careerField: CareerField | null
  experienceLevel: ExperienceLevel | null
  cvFileName: string | null
  jobDescription: string
  language: Language
  defaultMode: InterviewMode
  completed: boolean
  setCareerField: (field: CareerField) => void
  setExperienceLevel: (level: ExperienceLevel) => void
  setCvFileName: (name: string | null) => void
  setJobDescription: (text: string) => void
  setLanguage: (lang: Language) => void
  setDefaultMode: (mode: InterviewMode) => void
  complete: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      careerField: null,
      experienceLevel: null,
      cvFileName: null,
      jobDescription: '',
      language: 'English',
      defaultMode: 'text',
      completed: false,
      setCareerField: (careerField) => set({ careerField }),
      setExperienceLevel: (experienceLevel) => set({ experienceLevel }),
      setCvFileName: (cvFileName) => set({ cvFileName }),
      setJobDescription: (jobDescription) => set({ jobDescription }),
      setLanguage: (language) => set({ language }),
      setDefaultMode: (defaultMode) => set({ defaultMode }),
      complete: () => set({ completed: true }),
    }),
    { name: 'africoach-onboarding' },
  ),
)

export default useOnboardingStore
