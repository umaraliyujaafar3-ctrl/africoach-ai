import type { InterviewType } from '@/types'

export interface FeedbackDimension {
  id: string
  label: string
  score: number
}

export interface QuestionFeedback {
  questionId: string
  question: string
  answer: string
  score: number
  feedback: string
  tips: string[]
}

export interface FeedbackReport {
  sessionId: string
  interviewType: InterviewType
  jobRole: string
  date: string
  durationSec: number
  overallScore: number
  dimensions: FeedbackDimension[]
  questions: QuestionFeedback[]
  strengths: string[]
  areasToImprove: string[]
}
