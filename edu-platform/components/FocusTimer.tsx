'use client'

import { useState, useEffect, useRef } from 'react'
import { Timer, Pause, Play, RotateCcw } from 'lucide-react'

const WORK_MINUTES = 20
const BREAK_MINUTES = 5

export default function FocusTimer({ onSessionComplete }: { onSessionComplete?: () => void }) {
  const [isWork, setIsWork] = useState(true)
  const [timeLeft, setTimeLeft] = useState(WORK_MINUTES * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [showBreak, setShowBreak] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            if (isWork) {
              setShowBreak(true)
              setSessions(s => s + 1)
              onSessionComplete?.()
            } else {
              setIsWork(true)
              setTimeLeft(WORK_MINUTES * 60)
              setShowBreak(false)
            }
            // Play a gentle notification sound via oscillator
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              osc.connect(gain)
              gain.connect(ctx.destination)
              osc.frequency.setValueAtTime(523, ctx.currentTime)
              gain.gain.setValueAtTime(0.3, ctx.currentTime)
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1)
              osc.start()
              osc.stop(ctx.currentTime + 1)
            } catch {}
            return isWork ? BREAK_MINUTES * 60 : WORK_MINUTES * 60
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current!)
  }, [running, isWork, onSessionComplete])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const totalTime = isWork ? WORK_MINUTES * 60 : BREAK_MINUTES * 60
  const percent = ((totalTime - timeLeft) / totalTime) * 100

  const reset = () => {
    clearInterval(intervalRef.current!)
    setRunning(false)
    setIsWork(true)
    setTimeLeft(WORK_MINUTES * 60)
    setShowBreak(false)
  }

  const startBreak = () => {
    setIsWork(false)
    setTimeLeft(BREAK_MINUTES * 60)
    setShowBreak(false)
    setRunning(true)
  }

  const skipBreak = () => {
    setIsWork(true)
    setTimeLeft(WORK_MINUTES * 60)
    setShowBreak(false)
  }

  return (
    <div className={`rounded-2xl p-4 border-2 ${isWork ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
      {showBreak ? (
        <div className="text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="font-black text-gray-800 mb-1">Focus session done!</p>
          <p className="text-sm text-gray-600 mb-3">Take a 5-minute break — stand up, stretch, get water!</p>
          <div className="flex gap-2 justify-center">
            <button onClick={startBreak} className="btn-primary text-sm py-2 px-4">
              Start Break ☕
            </button>
            <button onClick={skipBreak} className="btn-secondary text-sm py-2 px-4">
              Keep Going 💪
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Timer className={`w-4 h-4 ${isWork ? 'text-blue-600' : 'text-green-600'}`} />
              <span className={`text-xs font-black ${isWork ? 'text-blue-700' : 'text-green-700'}`}>
                {isWork ? `🎯 Focus Time (${sessions} done)` : '☕ Break Time'}
              </span>
            </div>
            <button onClick={reset} className="p-1 hover:bg-white rounded-lg transition-colors" title="Reset">
              <RotateCcw className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Circular progress */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke={isWork ? '#3b82f6' : '#10b981'}
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - percent / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-black text-gray-700">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRunning(r => !r)}
                className={`flex items-center gap-2 font-bold py-2 px-4 rounded-xl text-sm transition-all hover:scale-105 ${
                  isWork
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {running ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
