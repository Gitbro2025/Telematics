'use client'

import { useState, useEffect } from 'react'
import { QuizQuestion } from '@/lib/types'
import { CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react'
import TextToSpeech from './TextToSpeech'

interface Props {
  questions: QuizQuestion[]
  onComplete: (score: number, stars: number) => void
}

export default function QuizModule({ questions, onComplete }: Props) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [celebrateEffect, setCelebrateEffect] = useState(false)

  const q = questions[current]
  const totalQ = questions.length

  const selectAnswer = (optIdx: number) => {
    if (selected !== null) return
    setSelected(optIdx)
    const newAnswers = [...answers]
    newAnswers[current] = optIdx
    setAnswers(newAnswers)
    setShowResult(true)
    if (optIdx === q.correctIndex) {
      setCelebrateEffect(true)
      setTimeout(() => setCelebrateEffect(false), 800)
    }
  }

  const next = () => {
    setShowExplanation(false)
    if (current + 1 < totalQ) {
      setCurrent(c => c + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      // Calculate score
      const allAnswers = answers.slice()
      allAnswers[current] = selected
      const correct = allAnswers.filter((a, i) => a === questions[i].correctIndex).length
      const pct = Math.round((correct / totalQ) * 100)
      setScore(pct)
      const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0
      setFinished(true)
      onComplete(pct, stars)
    }
  }

  const retry = () => {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setShowResult(false)
    setShowExplanation(false)
    setFinished(false)
    setScore(0)
  }

  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0
  const correct = answers.filter((a, i) => a !== null && a === questions[i]?.correctIndex).length

  if (finished) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">
          {score === 100 ? '🏆' : score >= 70 ? '🎉' : score >= 50 ? '😊' : '💪'}
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2">
          {score === 100 ? 'PERFECT!' : score >= 70 ? 'Great Job!' : score >= 50 ? 'Good Effort!' : 'Keep Trying!'}
        </h2>
        <p className="text-gray-600 font-semibold mb-4">
          You got <strong className="text-blue-600">{correct} out of {totalQ}</strong> questions correct
        </p>
        <div className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          {score}%
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(i => (
            <span
              key={i}
              className={`text-4xl transition-all duration-300 ${
                i <= stars ? 'star-pop opacity-100' : 'opacity-30'
              }`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={retry} className="flex items-center gap-2 btn-secondary">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-3xl shadow-xl p-6 transition-all duration-200 ${celebrateEffect ? 'scale-102 bg-green-50' : ''}`}>
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-black text-gray-500">
          Question {current + 1} of {totalQ}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded-full transition-all ${
                i < current
                  ? answers[i] === questions[i].correctIndex
                    ? 'bg-green-400'
                    : 'bg-red-400'
                  : i === current
                  ? 'bg-blue-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-3xl">{q.emoji || '❓'}</span>
            <h3 className="font-black text-gray-800 text-xl leading-snug">{q.question}</h3>
          </div>
          <TextToSpeech text={q.question} />
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-4">
        {q.options.map((option, idx) => {
          let optionStyle = 'quiz-option'
          if (selected !== null) {
            if (idx === q.correctIndex) optionStyle = 'quiz-option-correct w-full text-left p-4 rounded-2xl border-2 border-green-400 bg-green-50 text-green-700 font-semibold cursor-pointer'
            else if (idx === selected && idx !== q.correctIndex) optionStyle = 'quiz-option-incorrect w-full text-left p-4 rounded-2xl border-2 border-red-400 bg-red-50 text-red-700 font-semibold cursor-pointer'
            else optionStyle = 'w-full text-left p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 text-gray-500 font-semibold cursor-not-allowed opacity-60'
          }

          return (
            <button
              key={idx}
              className={optionStyle}
              onClick={() => selectAnswer(idx)}
              disabled={selected !== null}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600 flex-shrink-0">
                  {['A', 'B', 'C', 'D'][idx]}
                </span>
                <span>{option}</span>
                {selected !== null && idx === q.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-green-600 ml-auto flex-shrink-0" />
                )}
                {selected !== null && idx === selected && idx !== q.correctIndex && (
                  <XCircle className="w-5 h-5 text-red-600 ml-auto flex-shrink-0" />
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className={`rounded-2xl p-4 mb-4 ${selected === q.correctIndex ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {selected === q.correctIndex ? (
              <><span className="text-xl">🎉</span><span className="font-black text-green-700">Correct! Well done!</span></>
            ) : (
              <><span className="text-xl">💡</span><span className="font-black text-red-700">Not quite — here's why:</span></>
            )}
          </div>
          <p className="text-gray-700 font-semibold text-sm">{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {selected !== null && (
        <button
          onClick={next}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {current + 1 < totalQ ? (
            <>Next Question <ArrowRight className="w-4 h-4" /></>
          ) : (
            <>See Results <Trophy className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  )
}
