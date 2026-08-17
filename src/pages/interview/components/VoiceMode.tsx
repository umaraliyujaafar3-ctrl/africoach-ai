import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Redo2, Send, Square, Type } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/cn'

const MOCK_TRANSCRIPT = [
  "I've worked on a few projects where I had to balance tight deadlines with quality.",
  "In my last role I was responsible for delivering reports to clients on a weekly basis.",
  "I think my biggest strength is staying calm under pressure and communicating clearly with my team.",
]

interface VoiceModeProps {
  isThinking: boolean
  onSendAnswer: (text: string) => void
  onSwitchToText: () => void
}

export function VoiceMode({ isThinking, onSendAnswer, onSwitchToText }: VoiceModeProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recordingRef = useRef(false)

  const stopMock = () => {
    setIsRecording(false)
    recordingRef.current = false
  }

  const startMock = () => {
    recordingRef.current = true
    setIsRecording(true)
    setTranscript('')
    window.setTimeout(() => {
      if (!recordingRef.current) return
      stopMock()
      streamMockTranscript()
    }, 2600)
  }

  const streamMockTranscript = () => {
    let acc = ''
    MOCK_TRANSCRIPT.forEach((sentence, i) => {
      window.setTimeout(() => {
        acc += (i > 0 ? ' ' : '') + sentence
        setTranscript(acc)
      }, i * 500 + 200)
    })
  }

  useEffect(() => {
    return () => {
      recordingRef.current = false
    }
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        <div className="flex min-h-[120px] w-full max-w-lg flex-col items-center justify-center">
          {isRecording ? (
            <Waveform />
          ) : transcript ? (
            <div className="w-full rounded-2xl border border-ink-100 bg-ink-50/60 p-4 text-left">
              <p className="text-sm leading-relaxed text-ink-800">{transcript}</p>
            </div>
          ) : (
            <p className="text-sm text-ink-500">Tap the mic and speak your answer naturally.</p>
          )}
        </div>

        <div className="relative mt-4 flex items-center justify-center">
          <AnimatedRings active={isRecording} />
          <motion.button
            type="button"
            onClick={isRecording ? stopMock : startMock}
            disabled={isThinking}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'relative z-10 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lift transition-colors',
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-sunrise-500 hover:bg-sunrise-600',
              isThinking && 'cursor-not-allowed opacity-60',
            )}
          >
            {isRecording ? (
              <Square className="h-7 w-7" fill="currentColor" aria-hidden="true" />
            ) : (
              <Mic className="h-8 w-8" aria-hidden="true" />
            )}
          </motion.button>
        </div>

        <p className="mt-4 h-5 text-xs font-medium tabular-nums text-ink-500">
          {isThinking
            ? 'The interviewer is listening…'
            : isRecording
              ? 'Recording… speak now'
              : transcript
                ? 'Transcript ready — edit, redo, or send'
                : ''}
        </p>

        <div className="mt-4 flex items-center gap-3">
          {transcript && !isRecording && !isThinking && (
            <>
              <Button variant="ghost" onClick={() => setTranscript('')}>
                <Redo2 className="h-4 w-4" /> Redo
              </Button>
              <Button onClick={() => onSendAnswer(transcript)}>
                <Send className="h-4 w-4" /> Send answer
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-ink-100 px-1 py-3">
        <Button variant="ghost" size="sm" onClick={onSwitchToText}>
          <Type className="h-4 w-4" /> Switch to text
        </Button>
        <p className="text-xs text-ink-500">Voice mode</p>
      </div>
    </div>
  )
}

function Waveform() {
  const bars = Array.from({ length: 24 })
  return (
    <div className="flex h-14 items-end justify-center gap-1" aria-hidden="true">
      {bars.map((_, i) => (
        <motion.span
          key={i}
          className="w-1.5 rounded-full bg-sunrise-500"
          animate={{ height: ['15%', '85%', '30%', '95%', '20%'] }}
          transition={{
            duration: 0.9 + (i % 5) * 0.12,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: (i % 7) * 0.06,
          }}
        />
      ))}
    </div>
  )
}

function AnimatedRings({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <>
      <motion.span
        aria-hidden="true"
        className="absolute h-20 w-20 rounded-full bg-sunrise-400/40"
        animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute h-20 w-20 rounded-full bg-sunrise-400/30"
        animate={{ scale: [1, 2.1], opacity: [0.5, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.35 }}
      />
    </>
  )
}

export default VoiceMode
