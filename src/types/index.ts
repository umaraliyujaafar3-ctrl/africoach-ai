export const CAREER_FIELDS = [
  'Software Engineering',
  'Telecom Engineering',
  'Finance',
  'Marketing',
  'Healthcare',
  'Customer Service',
  'Other',
] as const

export type CareerField = (typeof CAREER_FIELDS)[number]

export const EXPERIENCE_LEVELS = [
  'Student',
  'Recent Graduate',
  'Entry-Level',
  'Mid-Level',
  'Career Changer',
] as const

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]

export const INTERVIEW_TYPES = [
  'HR',
  'Behavioral',
  'Technical',
  'Internship',
  'Scholarship',
  'Graduate Trainee',
] as const

export type InterviewType = (typeof INTERVIEW_TYPES)[number]

export const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]

export const LANGUAGES = ['English', 'Hausa', 'French'] as const
export type Language = (typeof LANGUAGES)[number]

export type InterviewMode = 'text' | 'voice'

export interface User {
  name: string
  email: string
  avatar?: string | null
  careerField?: CareerField | null
  experienceLevel?: ExperienceLevel | null
}
