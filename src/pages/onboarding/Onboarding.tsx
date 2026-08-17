import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  FileText,
  Headset,
  HeartPulse,
  Megaphone,
  Mic,
  RadioTower,
  Sparkles,
  Type,
  UploadCloud,
  Wallet,
} from 'lucide-react'
import { useOnboardingStore } from '@/store/onboarding'
import { Button, ProgressBar } from '@/components/ui'
import { cn } from '@/lib/cn'
import {
  CAREER_FIELDS,
  EXPERIENCE_LEVELS,
  type CareerField,
  type ExperienceLevel,
  type InterviewMode,
  type Language,
} from '@/types'

const careerIcons: Record<string, typeof Code2> = {
  'Software Engineering': Code2,
  'Telecom Engineering': RadioTower,
  Finance: Wallet,
  Marketing: Megaphone,
  Healthcare: HeartPulse,
  'Customer Service': Headset,
  Other: Sparkles,
}

const stepTitles = ['Your field', 'Experience', 'Your CV', 'Preferences']

const spring = { type: 'spring', stiffness: 400, damping: 30 } as const

export default function Onboarding() {
  const navigate = useNavigate()
  const store = useOnboardingStore()
  const [step, setStep] = useState(0)

  const canContinue = () => {
    if (step === 0) return store.careerField !== null
    if (step === 1) return store.experienceLevel !== null
    if (step === 2) return true
    return true
  }

  const handleFinish = () => {
    store.complete()
    navigate('/dashboard', { replace: true })
  }

  const showSuccess = step === 4

  return (
    <div className="flex min-h-screen flex-col bg-ink-50/50">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <span className="font-display text-lg font-bold text-ink-900">
            AfriCoach<span className="text-sunrise-500"> AI</span>
          </span>
          {!showSuccess && (
            <span className="text-sm font-medium text-ink-500">
              Step {Math.min(step + 1, 4)} of 4
            </span>
          )}
        </div>
        {!showSuccess && (
          <div className="mx-auto max-w-3xl px-4 pb-4 sm:px-6">
            <ProgressBar value={(step + 1) / 4} max={1} ariaLabel="Onboarding progress" />
          </div>
        )}
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="w-full max-w-3xl">
          {!showSuccess && (
            <div className="mb-8 text-center">
              <h1 className="font-display text-2xl font-bold text-ink-950 sm:text-3xl">
                {stepTitles[step]}
              </h1>
              <p className="mt-2 text-sm text-ink-500 sm:text-base">
                {step === 0 && 'What area are you building a career in?'}
                {step === 1 && 'Where are you on your career journey?'}
                {step === 2 && 'Help us tailor questions to your experience (optional)'}
                {step === 3 && 'A few preferences to make practice feel like home'}
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {CAREER_FIELDS.map((field) => {
                    const Icon = careerIcons[field]
                    const active = store.careerField === field
                    return (
                      <button
                        key={field}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => store.setCareerField(field as CareerField)}
                        className={cn(
                          'flex items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all',
                          active
                            ? 'border-sunrise-500 shadow-glow'
                            : 'border-ink-100 hover:border-ink-200 hover:shadow-soft',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                            active ? 'bg-sunrise-500 text-white' : 'bg-ink-50 text-ink-500',
                          )}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-ink-900">{field}</span>
                          {field === 'Other' && (
                            <span className="block text-xs text-ink-500">I'll specify</span>
                          )}
                        </span>
                        {active && <Check className="h-5 w-5 text-sunrise-600" aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {EXPERIENCE_LEVELS.map((level) => {
                  const active = store.experienceLevel === level
                  return (
                    <button
                      key={level}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => store.setExperienceLevel(level as ExperienceLevel)}
                      className={cn(
                        'flex items-center justify-between rounded-2xl border-2 bg-white p-4 text-left transition-all',
                        active
                          ? 'border-sunrise-500 shadow-glow'
                          : 'border-ink-100 hover:border-ink-200 hover:shadow-soft',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full border-2',
                            active ? 'border-sunrise-500' : 'border-ink-300',
                          )}
                        >
                          {active && <span className="h-2.5 w-2.5 rounded-full bg-sunrise-500" />}
                        </span>
                        <span className="text-sm font-semibold text-ink-900">{level}</span>
                      </span>
                    </button>
                  )
                })}
              </motion.div>
            )}

            {step === 2 && <CvStep />}

            {step === 3 && <PreferencesStep />}
          </AnimatePresence>

          {!showSuccess && (
            <div className="mt-10 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              {step < 3 ? (
                <Button onClick={() => canContinue() && setStep((s) => s + 1)} disabled={!canContinue()}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleFinish} size="lg">
                  <Sparkles className="h-4 w-4" /> I'm Ready
                </Button>
              )}
            </div>
          )}

          <AnimatePresence>{showSuccess && <SuccessScreen onDone={handleFinish} />}</AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function CvStep() {
  const store = useOnboardingStore()
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (file) {
      const ok = /\.(pdf|docx?)$/i.test(file.name)
      store.setCvFileName(ok ? file.name : null)
    }
  }

  return (
    <motion.div
      key="s3"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload CV or resume"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white px-6 py-12 text-center transition-all',
          dragOver ? 'border-sunrise-500 bg-sunrise-50' : 'border-ink-200 hover:border-ink-300',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {store.cvFileName ? (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FileText className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-semibold text-ink-900">{store.cvFileName}</p>
            <p className="mt-1 text-xs text-ink-500">Click to replace</p>
          </>
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sunrise-50 text-sunrise-600">
              <UploadCloud className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-semibold text-ink-900">
              Drag & drop your CV, or click to browse
            </p>
            <p className="mt-1 text-xs text-ink-500">PDF or DOCX · helps tailor your questions</p>
          </>
        )}
      </div>

      <div className="flex justify-center">
        <Button variant="ghost" size="sm" onClick={() => store.setCvFileName(null)}>
          Skip this step
        </Button>
      </div>

      <div>
        <label
          htmlFor="job-description"
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          Paste a job description (optional)
        </label>
        <textarea
          id="job-description"
          rows={4}
          placeholder="Paste the job description you're applying for and we'll tailor questions to it…"
          value={store.jobDescription}
          onChange={(e) => store.setJobDescription(e.target.value)}
          className="w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 focus:border-sunrise-500 focus:outline-none focus:ring-2 focus:ring-sunrise-500/30"
        />
      </div>
    </motion.div>
  )
}

function PreferencesStep() {
  const store = useOnboardingStore()

  const languageOptions: { value: Language; note?: string }[] = [
    { value: 'English' },
    { value: 'Hausa' },
    { value: 'French' },
  ]

  const modeOptions: { value: InterviewMode; icon: typeof Mic; label: string; hint: string }[] = [
    { value: 'voice', icon: Mic, label: 'Voice', hint: 'Speak your answers' },
    { value: 'text', icon: Type, label: 'Text', hint: 'Type your answers' },
  ]

  return (
    <motion.div
      key="s4"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      <div>
        <h2 className="mb-3 text-base font-semibold text-ink-900">Practice language</h2>
        <div className="grid grid-cols-3 gap-3">
          {languageOptions.map((opt) => {
            const active = store.language === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => store.setLanguage(opt.value)}
                className={cn(
                  'rounded-2xl border-2 bg-white px-4 py-4 text-center transition-all',
                  active ? 'border-sunrise-500 shadow-glow' : 'border-ink-100 hover:border-ink-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50',
                )}
              >
                <span className="block text-sm font-semibold text-ink-900">{opt.value}</span>
                {opt.note && <span className="mt-1 block text-xs text-ink-500">{opt.note}</span>}
              </button>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-ink-500">More languages coming soon</p>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-ink-900">Preferred interview mode</h2>
        <div className="grid grid-cols-2 gap-3">
          {modeOptions.map((opt) => {
            const active = store.defaultMode === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => store.setDefaultMode(opt.value)}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border-2 bg-white px-5 py-4 text-left transition-all',
                  active ? 'border-sunrise-500 shadow-glow' : 'border-ink-100 hover:border-ink-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunrise-500/50',
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    active ? 'bg-sunrise-500 text-white' : 'bg-ink-50 text-ink-500',
                  )}
                >
                  <opt.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900">{opt.label}</span>
                  <span className="block text-xs text-ink-500">{opt.hint}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

function SuccessScreen({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate()
  const pieces = Array.from({ length: 18 })

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center py-10 text-center"
    >
      <div className="pointer-events-none absolute inset-0 flex justify-center" aria-hidden="true">
        {pieces.map((_, i) => {
          const left = 10 + ((i * 53) % 80)
          const delay = (i % 6) * 0.12
          const color = ['bg-sunrise-400', 'bg-emerald-400', 'bg-sky-400', 'bg-amber-400'][i % 4]
          return (
            <motion.span
              key={i}
              initial={{ y: -20, opacity: 1 }}
              animate={{ y: [0, 240, 320], opacity: [1, 1, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 2.2, delay, ease: 'easeIn', repeat: Infinity, repeatDelay: 1 }}
              className={cn('absolute top-0 h-3 w-3 rounded-sm', color)}
              style={{ left: `${left}%` }}
            />
          )
        })}
      </div>

      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lift"
      >
        <Check className="h-10 w-10" aria-hidden="true" />
      </motion.span>

      <h1 className="mt-6 font-display text-3xl font-bold text-ink-950">You're all set!</h1>
      <p className="mt-3 max-w-md text-ink-500">
        Your coaching profile is ready. Let's get you to your first practice interview.
      </p>
      <Button
        size="lg"
        className="mt-8"
        onClick={() => {
          onDone()
          navigate('/dashboard')
        }}
      >
        Go to Dashboard <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}
