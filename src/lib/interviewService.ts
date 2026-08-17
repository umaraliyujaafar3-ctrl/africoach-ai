import type { InterviewQuestion, InterviewSetup } from '@/store/interview'
import type { InterviewType } from '@/types'

type QuestionBank = Record<InterviewType, Omit<InterviewQuestion, 'id' | 'category'>[]>

const banks: QuestionBank = {
  HR: [
    { type: 'hr', question: 'Tell me a bit about yourself and why you\'re interested in this role.' },
    { type: 'hr', question: 'Where do you see yourself in five years, and how does this role fit into that plan?' },
    { type: 'hr', question: 'Why should we hire you over other candidates?' },
    { type: 'hr', question: 'What do you know about our company and what we do?' },
    { type: 'hr', question: 'Tell me about a time you had to work under pressure. How did you handle it?' },
    { type: 'hr', question: 'What are your salary expectations for this position?' },
    { type: 'hr', question: 'Do you have any questions for us?' },
  ],
  Behavioral: [
    { type: 'behavioral', starTagged: true, question: 'Tell me about a time you faced a challenging deadline. How did you manage it?' },
    { type: 'behavioral', starTagged: true, question: 'Describe a situation where you disagreed with a teammate. What did you do?' },
    { type: 'behavioral', starTagged: true, question: 'Give me an example of a time you showed leadership, even without a title.' },
    { type: 'behavioral', starTagged: true, question: 'Tell me about a mistake you made at work or school. How did you handle it?' },
    { type: 'behavioral', starTagged: true, question: 'Describe a time you had to learn something new quickly. What was your approach?' },
    { type: 'behavioral', starTagged: true, question: 'Tell me about a time you received difficult feedback. How did you respond?' },
    { type: 'behavioral', starTagged: true, question: 'Share an example of when you went above and beyond what was expected.' },
  ],
  Technical: [
    { type: 'technical', question: 'Walk me through the most recent project you worked on. What was your specific contribution?' },
    { type: 'technical', question: 'What technical skill are you strongest in, and how have you applied it recently?' },
    { type: 'technical', question: 'Explain a technical concept to me as if I were a complete beginner.' },
    { type: 'technical', question: 'Tell me about a challenging technical problem you solved. What was your process?' },
    { type: 'technical', question: 'How do you stay up to date with developments in your field?' },
    { type: 'technical', question: 'Describe a time you had to debug or fix something under time pressure.' },
    { type: 'technical', question: 'What would you do differently on your last project if you could go back?' },
  ],
  Internship: [
    { type: 'internship', question: 'Why are you interested in this internship, and what do you hope to gain from it?' },
    { type: 'internship', question: 'What is the most interesting thing you have learned in your studies so far?' },
    { type: 'internship', question: 'Tell me about a project or assignment you are proud of.' },
    { type: 'internship', question: 'How do you handle being given a task you don\'t know how to do yet?' },
    { type: 'internship', question: 'What strengths do you bring as someone early in your career?' },
    { type: 'internship', question: 'Where do you hope this internship leads you?' },
  ],
  Scholarship: [
    { type: 'scholarship', question: 'Tell us about your academic background and why you chose your field of study.' },
    { type: 'scholarship', question: 'What are your career goals, and how will this scholarship help you achieve them?' },
    { type: 'scholarship', question: 'Describe a challenge you have overcome in your education journey.' },
    { type: 'scholarship', question: 'What will you give back to your community after completing your studies?' },
    { type: 'scholarship', question: 'Why should you be selected over other qualified candidates?' },
    { type: 'scholarship', question: 'What are you most passionate about, and why?' },
  ],
  'Graduate Trainee': [
    { type: 'graduate-trainee', question: 'What makes you a good fit for our graduate trainee program?' },
    { type: 'graduate-trainee', question: 'Tell me about a time you worked effectively in a team.' },
    { type: 'graduate-trainee', question: 'How do you approach learning a completely new skill or system?' },
    { type: 'graduate-trainee', question: 'Describe a situation where you had to adapt to change quickly.' },
    { type: 'graduate-trainee', question: 'What area of our business interests you most and why?' },
    { type: 'graduate-trainee', question: 'Tell me about a goal you set and achieved. What steps did you take?' },
  ],
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions(setup: InterviewSetup): InterviewQuestion[] {
  const type = setup.interviewType ?? 'HR'
  const pool = banks[type] ?? banks.HR
  const count = type === 'Technical' ? 8 : 7
  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map((q, i) => ({
      ...q,
      id: `${type.toLowerCase().replace(/\s+/g, '-')}-${i + 1}-${Date.now()}`,
      category: type,
    }))
}

const DELAY = 700

/**
 * The single integration point for the live interview session.
 * Currently returns mock questions from a local bank. To connect a real
 * backend, replace the body of this function with your API call and keep
 * the same return shape.
 */
export async function getInterviewQuestions(setup: InterviewSetup): Promise<InterviewQuestion[]> {
  await new Promise((resolve) => setTimeout(resolve, DELAY))
  return buildQuestions(setup)
}

export default getInterviewQuestions
