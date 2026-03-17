'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import ContentBlockComponent from '@/components/ContentBlock'
import QuizModule from '@/components/QuizModule'
import FocusTimer from '@/components/FocusTimer'
import TextToSpeech from '@/components/TextToSpeech'
import { getSubject, getSubTopic, getTopic } from '@/lib/curriculum'
import { getProgress, markSubTopicComplete } from '@/lib/progress'
import { SubTopic, UserProgress } from '@/lib/types'
import { ChevronLeft, Star, Zap, BookOpen, HelpCircle, Bot, Lightbulb, ChevronRight } from 'lucide-react'

type Tab = 'content' | 'examples' | 'quiz'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const [subTopic, setSubTopic] = useState<SubTopic | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [tab, setTab] = useState<Tab>('content')
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([])
  const [quizComplete, setQuizComplete] = useState(false)
  const [earnedStars, setEarnedStars] = useState(0)
  const [celebrationVisible, setCelebrationVisible] = useState(false)
  const [focusSessions, setFocusSessions] = useState(0)
  const [aiQuestion, setAiQuestion] = useState('')
  const mainRef = useRef<HTMLDivElement>(null)

  const subjectId = params.subject as string
  const topicId = params.topic as string
  const subTopicId = params.subtopic as string

  useEffect(() => {
    const st = getSubTopic(subjectId, topicId, subTopicId)
    if (st) {
      setSubTopic(st)
      setRevealedBlocks([0])
    }
    setProgress(getProgress())
  }, [subjectId, topicId, subTopicId])

  const subject = getSubject(subjectId)
  const topic = getTopic(subjectId, topicId)
  const alreadyCompleted = progress?.completedSubTopics.includes(subTopicId)
  const existingStars = progress?.stars[subTopicId] || 0

  const revealNextBlock = () => {
    if (!subTopic) return
    const contentBlocks = subTopic.contentBlocks
    const nextIdx = revealedBlocks.length
    if (nextIdx < contentBlocks.length) {
      setRevealedBlocks(prev => [...prev, nextIdx])
      setTimeout(() => mainRef.current?.scrollBy({ top: 200, behavior: 'smooth' }), 100)
    }
  }

  const allBlocksRevealed = subTopic ? revealedBlocks.length >= subTopic.contentBlocks.length : false

  const handleQuizComplete = (score: number, stars: number) => {
    if (!subTopic) return
    const updated = markSubTopicComplete(subTopicId, score, stars)
    setProgress(updated)
    setEarnedStars(stars)
    setQuizComplete(true)
    if (stars > 0) {
      setCelebrationVisible(true)
      setTimeout(() => setCelebrationVisible(false), 3000)
    }
  }

  const handleFocusSessionComplete = () => {
    setFocusSessions(s => s + 1)
    const p = getProgress()
    p.focusSessions = (p.focusSessions || 0) + 1
    const { saveProgress } = require('@/lib/progress')
    saveProgress(p)
  }

  if (!subTopic || !subject || !topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔍</div>
          <p className="text-xl font-bold text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  const contentBlocks = subTopic.contentBlocks
  const exampleBlocks = contentBlocks.filter(b => b.type === 'example')
  const theoryBlocks = contentBlocks.filter(b => b.type !== 'example')

  const tabDisplayBlocks = tab === 'content' ? theoryBlocks : exampleBlocks
  const showBlocks = tab === 'content' ? theoryBlocks : exampleBlocks

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Celebration overlay */}
      {celebrationVisible && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <div className="bg-white rounded-3xl px-8 py-4 shadow-2xl">
              <p className="text-3xl font-black text-gray-800">
                {'⭐'.repeat(earnedStars)} Amazing! {'⭐'.repeat(earnedStars)}
              </p>
              <p className="text-gray-600 font-semibold">{earnedStars === 3 ? 'Perfect score!' : 'Well done!'}</p>
            </div>
          </div>
        </div>
      )}

      <Navigation />
      <main ref={mainRef} className="lg:ml-64 pt-16 lg:pt-0 pb-24 lg:pb-8 min-h-screen">
        {/* Header */}
        <div className={`bg-gradient-to-r ${subject.gradient} pt-4 pb-6 px-5`}>
          <div className="max-w-3xl mx-auto">
            <nav className="flex items-center gap-2 text-white text-opacity-70 text-sm font-semibold mb-3 flex-wrap">
              <Link href={`/subjects/${subjectId}`} className="hover:text-opacity-100">
                {subject.emoji} {subject.title}
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{topic.emoji} {topic.title}</span>
            </nav>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{subTopic.emoji}</span>
              <div className="flex-1">
                <h1 className="text-2xl font-black text-white mb-1">{subTopic.title}</h1>
                <p className="text-white text-opacity-80 font-semibold text-sm">{subTopic.description}</p>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <span className="text-white text-opacity-70 text-xs font-semibold">⏱ ~{subTopic.duration} min</span>
                  <span className="text-white text-opacity-70 text-xs font-semibold">
                    {'⭐'.repeat(subTopic.difficulty)}{'☆'.repeat(3 - subTopic.difficulty)} difficulty
                  </span>
                  {(alreadyCompleted || existingStars > 0) && (
                    <span className="text-yellow-300 font-bold text-xs">
                      {'⭐'.repeat(existingStars)} Completed!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-5">
          {/* Fun fact banner */}
          {subTopic.funFact && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-5 flex gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-yellow-800 text-sm mb-1">Did You Know? 🌟</p>
                <p className="text-yellow-700 font-semibold text-sm">{subTopic.funFact}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex bg-white rounded-2xl p-1 shadow-md mb-5 gap-1">
                {([
                  { id: 'content', label: 'Learn', emoji: '📖' },
                  { id: 'examples', label: 'Examples', emoji: '✏️' },
                  { id: 'quiz', label: 'Quiz', emoji: '🎯' },
                ] as const).map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-sm transition-all ${
                      tab === t.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Content blocks */}
              {tab !== 'quiz' && (
                <div className="space-y-4">
                  {(tab === 'content' ? theoryBlocks : exampleBlocks).map((block, idx) => (
                    <ContentBlockComponent
                      key={idx}
                      block={block}
                      index={idx}
                      isRevealed={revealedBlocks.includes(idx) || tab === 'examples'}
                      onReveal={() => setRevealedBlocks(prev =>
                        prev.includes(idx) ? prev : [...prev, idx]
                      )}
                    />
                  ))}

                  {/* Reveal next button (content tab only) */}
                  {tab === 'content' && !allBlocksRevealed && revealedBlocks.length < theoryBlocks.length && (
                    <button
                      onClick={revealNextBlock}
                      className="w-full btn-secondary flex items-center justify-center gap-2 py-4"
                    >
                      <span>Show Next Part</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {tab === 'content' && allBlocksRevealed && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center">
                      <p className="font-black text-green-700 text-lg mb-2">🎉 You read all the content!</p>
                      <p className="text-green-600 font-semibold mb-4">
                        Now try the examples and then test yourself with the quiz!
                      </p>
                      <div className="flex gap-3 justify-center flex-wrap">
                        <button onClick={() => setTab('examples')} className="btn-secondary flex items-center gap-2">
                          ✏️ See Examples
                        </button>
                        <button onClick={() => setTab('quiz')} className="btn-primary flex items-center gap-2">
                          🎯 Take Quiz
                        </button>
                      </div>
                    </div>
                  )}

                  {tab === 'examples' && exampleBlocks.length === 0 && (
                    <div className="bg-blue-50 rounded-2xl p-6 text-center">
                      <p className="text-blue-600 font-bold">Examples are shown in the Learn tab! 📖</p>
                      <button onClick={() => setTab('content')} className="mt-3 btn-secondary text-sm">
                        Go to Learn tab
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Quiz tab */}
              {tab === 'quiz' && (
                <div>
                  {quizComplete && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-black text-green-700">Lesson Complete!</p>
                        <p className="text-green-600 font-semibold text-sm">
                          You earned {earnedStars} {'⭐'.repeat(earnedStars)} • {progress?.quizScores[subTopicId]}% score
                        </p>
                      </div>
                    </div>
                  )}
                  <QuizModule
                    questions={subTopic.quiz}
                    onComplete={handleQuizComplete}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Focus timer */}
              <FocusTimer onSessionComplete={handleFocusSessionComplete} />

              {/* AI Tutor shortcut */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-4">
                <h3 className="font-black text-purple-800 mb-2 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Ask AI Tutor
                </h3>
                <p className="text-purple-600 text-sm font-semibold mb-3">
                  Stuck? Ask about {subTopic.title}!
                </p>
                <Link
                  href={`/ai-tutor?subject=${subjectId}&topic=${subTopic.title}`}
                  className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  Open AI Tutor
                </Link>
              </div>

              {/* Read aloud full lesson */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <h3 className="font-black text-blue-800 mb-2 flex items-center gap-2">
                  <span>🔊</span> Read Aloud
                </h3>
                <p className="text-blue-600 text-sm font-semibold mb-3">
                  Listen to the whole lesson!
                </p>
                <TextToSpeech
                  text={contentBlocks.map(b => `${b.title || ''}. ${b.content}`).join('. ')}
                />
              </div>

              {/* Progress in topic */}
              {progress && (
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-4">
                  <h3 className="font-black text-gray-800 mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    My Progress
                  </h3>
                  <p className="text-sm text-gray-500 font-semibold mb-1">
                    Total Points: <span className="text-blue-600 font-black">{progress.totalPoints}</span>
                  </p>
                  <p className="text-sm text-gray-500 font-semibold mb-1">
                    Lessons Done: <span className="text-green-600 font-black">{progress.completedSubTopics.length}</span>
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">
                    Streak: <span className="text-orange-600 font-black">🔥 {progress.streakDays} days</span>
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-2">
                <Link
                  href={`/subjects/${subjectId}`}
                  className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
