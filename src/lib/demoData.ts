import type { FeedbackReport } from '@/types/feedback'

const now = Date.now()
const day = 24 * 60 * 60 * 1000

function iso(daysAgo: number) {
  return new Date(now - daysAgo * day).toISOString()
}

export const MOCK_REPORTS: FeedbackReport[] = [
  {
    sessionId: 'demo-1',
    interviewType: 'HR',
    jobRole: 'Graduate Trainee',
    date: iso(28),
    durationSec: 910,
    overallScore: 58,
    dimensions: [
      { id: 'clarity', label: 'Clarity', score: 60 },
      { id: 'confidence', label: 'Confidence', score: 52 },
      { id: 'communication', label: 'Communication', score: 62 },
      { id: 'grammar', label: 'Grammar', score: 71 },
      { id: 'structure', label: 'Structure', score: 50 },
      { id: 'professionalism', label: 'Professionalism', score: 63 },
      { id: 'relevance', label: 'Relevance', score: 55 },
    ],
    questions: [],
    strengths: ['You showed up and practised — consistency beats perfection.'],
    areasToImprove: ['Structure needs the most attention next time.'],
  },
  {
    sessionId: 'demo-2',
    interviewType: 'Behavioral',
    jobRole: 'Software Engineer',
    date: iso(21),
    durationSec: 1180,
    overallScore: 64,
    dimensions: [
      { id: 'clarity', label: 'Clarity', score: 66 },
      { id: 'confidence', label: 'Confidence', score: 60 },
      { id: 'communication', label: 'Communication', score: 67 },
      { id: 'grammar', label: 'Grammar', score: 72 },
      { id: 'structure', label: 'Structure', score: 58 },
      { id: 'professionalism', label: 'Professionalism', score: 65 },
      { id: 'relevance', label: 'Relevance', score: 61 },
    ],
    questions: [],
    strengths: ['Communication — a clear standout in this session.'],
    areasToImprove: ['Structure needs the most attention next time.'],
  },
  {
    sessionId: 'demo-3',
    interviewType: 'Technical',
    jobRole: 'Frontend Developer',
    date: iso(14),
    durationSec: 1460,
    overallScore: 69,
    dimensions: [
      { id: 'clarity', label: 'Clarity', score: 71 },
      { id: 'confidence', label: 'Confidence', score: 66 },
      { id: 'communication', label: 'Communication', score: 70 },
      { id: 'grammar', label: 'Grammar', score: 73 },
      { id: 'structure', label: 'Structure', score: 63 },
      { id: 'professionalism', label: 'Professionalism', score: 68 },
      { id: 'relevance', label: 'Relevance', score: 67 },
    ],
    questions: [],
    strengths: ['Clarity — a clear standout in this session.'],
    areasToImprove: ['Confidence needs the most attention next time.'],
  },
  {
    sessionId: 'demo-4',
    interviewType: 'Internship',
    jobRole: 'Data Analyst',
    date: iso(7),
    durationSec: 1255,
    overallScore: 74,
    dimensions: [
      { id: 'clarity', label: 'Clarity', score: 76 },
      { id: 'confidence', label: 'Confidence', score: 70 },
      { id: 'communication', label: 'Communication', score: 75 },
      { id: 'grammar', label: 'Grammar', score: 78 },
      { id: 'structure', label: 'Structure', score: 71 },
      { id: 'professionalism', label: 'Professionalism', score: 72 },
      { id: 'relevance', label: 'Relevance', score: 73 },
    ],
    questions: [],
    strengths: ['Clarity — a clear standout in this session.'],
    areasToImprove: ['Confidence needs the most attention next time.'],
  },
  {
    sessionId: 'demo-5',
    interviewType: 'Graduate Trainee',
    jobRole: 'Graduate Trainee',
    date: iso(3),
    durationSec: 1380,
    overallScore: 79,
    dimensions: [
      { id: 'clarity', label: 'Clarity', score: 81 },
      { id: 'confidence', label: 'Confidence', score: 74 },
      { id: 'communication', label: 'Communication', score: 80 },
      { id: 'grammar', label: 'Grammar', score: 83 },
      { id: 'structure', label: 'Structure', score: 77 },
      { id: 'professionalism', label: 'Professionalism', score: 79 },
      { id: 'relevance', label: 'Relevance', score: 78 },
    ],
    questions: [],
    strengths: ['Grammar — a clear standout in this session.'],
    areasToImprove: ['Keep answering in full sentences to lock in your scores.'],
  },
]

export default MOCK_REPORTS
