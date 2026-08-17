import type { FeedbackReport, QuestionFeedback } from '@/types/feedback'
import type { InterviewAnswer, InterviewQuestion } from '@/store/interview'
import type { InterviewType } from '@/types'

const DIMENSION_IDS = [
  'clarity',
  'confidence',
  'communication',
  'grammar',
  'structure',
  'professionalism',
  'relevance',
] as const

function clampScore(n: number) {
  return Math.max(38, Math.min(96, Math.round(n)))
}

function seededScore(seed: number, variance = 9) {
  const noise = ((seed * 2654435761) % 1000) / 1000 - 0.5
  return clampScore(72 + noise * variance * 2)
}

function answerScore(answer: string, base: number) {
  const length = answer.trim().length
  let delta = 0
  if (length > 260) delta = 6
  else if (length > 160) delta = 3
  else if (length < 40) delta = -10
  return clampScore(base + delta)
}

function pickFeedback(score: number): { feedback: string; tips: string[] } {
  if (score >= 82) {
    return {
      feedback:
        'Strong answer. You covered the key points clearly and backed them with a concrete example — exactly what interviewers look for.',
      tips: ['Try to land your conclusion in one crisp sentence.', 'Quantify the outcome next time (e.g. "cut time by 30%").'],
    }
  }
  if (score >= 65) {
    return {
      feedback:
        'Solid response with good structure. It would land harder with more specific detail and a clearer sense of your personal contribution.',
      tips: ['Add one specific example or number.', 'Keep the introduction to under two sentences.'],
    }
  }
  return {
    feedback:
      'You touched on the right theme, but the answer stayed vague. Interviewers reward specific stories over general statements.',
    tips: ['Use the STAR structure (Situation, Task, Action, Result).', 'Practise out loud so the wording feels natural.'],
  }
}

/**
 * Mock feedback generator. Replace with a real scoring API call while
 * keeping the same FeedbackReport shape.
 */
export async function generateFeedback(input: {
  sessionId: string
  interviewType: InterviewType
  jobRole: string
  questions: InterviewQuestion[]
  answers: InterviewAnswer[]
  startedAt: number | null
}): Promise<FeedbackReport> {
  await new Promise((r) => setTimeout(r, 600))

  const byId = new Map(input.answers.map((a) => [a.questionId, a.answer]))
  const questionFeedback: QuestionFeedback[] = input.questions.map((q, i) => {
    const answer = byId.get(q.id) ?? ''
    const base = seededScore(i * 13 + q.question.length, 10)
    const score = answerScore(answer, base)
    const { feedback, tips } = pickFeedback(score)
    return { questionId: q.id, question: q.question, answer, score, feedback, tips }
  })

  const answered = questionFeedback.filter((q) => q.answer)
  const avg = answered.length
    ? Math.round(answered.reduce((s, q) => s + q.score, 0) / answered.length)
    : 55

  const dimensions = DIMENSION_IDS.map((id, i) => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    score: clampScore(avg + ((i * 7) % 9) - 4 + Math.round(Math.sin(i * 2.3) * 5)),
  }))

  const overallScore = clampScore(avg + 2)

  const strengths: string[] = []
  const areas: string[] = []
  dimensions.forEach((d) => {
    if (d.score >= 75) strengths.push(`${d.label} — a clear standout in this session.`)
    else if (d.score < 62) areas.push(`${d.label} needs the most attention next time.`)
  })
  if (strengths.length === 0) strengths.push('You showed up and practised — consistency beats perfection.')
  if (areas.length === 0) areas.push('Keep answering in full sentences to lock in your scores.')

  return {
    sessionId: input.sessionId,
    interviewType: input.interviewType,
    jobRole: input.jobRole,
    date: new Date().toISOString(),
    durationSec: input.startedAt ? Math.floor((Date.now() - input.startedAt) / 1000) : 0,
    overallScore,
    dimensions,
    questions: questionFeedback,
    strengths,
    areasToImprove: areas,
  }
}

export default generateFeedback
