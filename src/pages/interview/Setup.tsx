import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  Briefcase,
  Brain,
  GraduationCap,
  Heart,
  Lightbulb,
  Mic,
  Shield,
  Type,
  Users,
} from 'lucide-react'
import { useInterviewStore } from '@/store/interview'
import { useOnboardingStore } from '@/store/onboarding'
import { toast } from '@/store/toast'
import { Button, Input, Select, Textarea } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  DIFFICULTY_LEVELS,
  EXPERIENCE_LEVELS,
  INTERVIEW_TYPES,
  LANGUAGES,
  type DifficultyLevel,
  type ExperienceLevel,
  type InterviewMode,
  type InterviewType,
  type Language,
} from '@/types'

const typeIcons: Record<InterviewType, typeof Users> = {
  HR: Users,
  Behavioral: Brain,
  Technical: Briefcase,
  Internship: GraduationCap,
  Scholarship: Award,
  'Graduate Trainee': Shield,
}

const typeDescriptions: Record<InterviewType, string> = {
  HR: 'General fit & motivation',
  Behavioral: 'STAR-style storytelling',
  Technical: 'Role-specific technicals',
  Internship: 'Entry-level & potential',
  Scholarship: 'Academic & goals',
  'Graduate Trainee': 'Assessment centre style',
}

const tips = [
  { icon: Lightbulb, title: 'Find a quiet space', body: 'Minimize distractions so you can focus.' },
  { icon: Mic, title: 'Speak naturally', body: 'Don\'t try to sound robotic — be yourself.' },
  { icon: Heart, title: 'You can pause anytime', body: 'Take a breath. There\'s no time pressure.' },
]

export default function InterviewSetup() {
  const navigate = useNavigate()
  const setup = useInterviewStore((s) => s.setup)
  const setSetup = useInterviewStore((s) => s.setSetup)
  const onboarding = useOnboardingStore()
  const [experience, setExperience] = useState<ExperienceLevel | null>(
    setup.experienceLevel ?? onboarding.experienceLevel,
  )

  const required = () =>
    setup.interviewType !== null && setup.jobRole.trim().length > 0 && experience !== null

  const start = () => {
    setSetup({ experienceLevel: experience })
    toast('Interview started — good luck!', 'info')
    navigate('/interview/session')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">Interview type</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {INTERVIEW_TYPES.map((type) => {
              const Icon = typeIcons[type]
              const active = setup.interviewType === type
              return (
                <button
                  key={type}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSetup({ interviewType: type })}
                  className={cn(
                    'rounded-2xl border-2 bg-white p-4 text-left transition-all',
                    active
                      ? 'border-sunrise-500 shadow-glow'
                      : 'border-ink-100 hover:border-ink-200 hover:shadow-soft',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-xl',
                      active ? 'bg-sunrise-500 text-white' : 'bg-ink-50 text-ink-500',
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block text-sm font-semibold text-ink-900">{type}</span>
                  <span className="mt-0.5 block text-xs text-ink-500">{typeDescriptions[type]}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">Job details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Job role / title"
              placeholder="e.g. Frontend Developer"
              value={setup.jobRole}
              onChange={(e) => setSetup({ jobRole: e.target.value })}
              hint={onboarding.careerField ? `From your profile: ${onboarding.careerField}` : undefined}
            />
            <Select
              label="Experience level"
              placeholder="Select experience level"
              value={experience ?? ''}
              onChange={(e) => setExperience(e.target.value as ExperienceLevel)}
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">Difficulty</h2>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTY_LEVELS.map((level) => {
              const active = setup.difficulty === level
              return (
                <button
                  key={level}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSetup({ difficulty: level as DifficultyLevel })}
                  className={cn(
                    'rounded-xl border-2 bg-white px-3 py-3 text-sm font-semibold transition-all',
                    active
                      ? 'border-sunrise-500 text-sunrise-700 shadow-glow'
                      : 'border-ink-100 text-ink-500 hover:border-ink-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50',
                  )}
                >
                  {level}
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-ink-900">Mode & language</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-ink-800">Practice mode</span>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: 'voice', icon: Mic, label: 'Voice' },
                    { value: 'text', icon: Type, label: 'Text' },
                  ] as { value: InterviewMode; icon: typeof Mic; label: string }[]
                ).map((mode) => {
                  const active = setup.mode === mode.value
                  return (
                    <button
                      key={mode.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setSetup({ mode: mode.value })}
                      className={cn(
                        'flex items-center justify-center gap-2 rounded-xl border-2 bg-white px-3 py-2.5 text-sm font-semibold transition-all',
                        active
                          ? 'border-sunrise-500 text-sunrise-700 shadow-glow'
                          : 'border-ink-100 text-ink-500 hover:border-ink-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50',
                      )}
                    >
                      <mode.icon className="h-4 w-4" aria-hidden="true" /> {mode.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <Select
              label="Language"
              value={setup.language}
              onChange={(e) => setSetup({ language: e.target.value as Language })}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>
          </div>
        </section>

        <section>
          <Textarea
            label="Job description (optional)"
            placeholder="Paste the job description to get tailored questions…"
            rows={4}
            value={setup.jobDescription}
            onChange={(e) => setSetup({ jobDescription: e.target.value })}
            hint="Tailors questions to the specific role you're targeting"
          />
        </section>

        <div className="flex justify-end">
          <Button size="lg" onClick={start} disabled={!required()}>
            Start Interview <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-2xl border border-sunrise-100 bg-sunrise-50/60 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-sunrise-800">
            <Lightbulb className="h-4 w-4" aria-hidden="true" /> Before you start
          </p>
          <ul className="mt-4 space-y-4">
            {tips.map((tip) => (
              <li key={tip.title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sunrise-600 shadow-soft">
                  <tip.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{tip.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{tip.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
