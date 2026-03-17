'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { getSubject } from '@/lib/curriculum'
import { getProgress } from '@/lib/progress'
import { UserProgress, Subject } from '@/lib/types'
import { ChevronRight, Clock, Star, CheckCircle, Lock, ChevronLeft } from 'lucide-react'

export default function SubjectPage() {
  const params = useParams()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  useEffect(() => {
    const s = getSubject(params.subject as string)
    if (s) {
      setSubject(s)
      if (s.topics.length > 0) setExpandedTopic(s.topics[0].id)
    }
    setProgress(getProgress())
  }, [params.subject])

  if (!subject) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-black text-gray-700">Subject not found</h2>
        <Link href="/subjects" className="mt-4 inline-block btn-primary">Go back</Link>
      </div>
    </div>
  )

  const totalSubTopics = subject.topics.reduce((acc, t) => acc + t.subTopics.length, 0)
  const completedCount = progress
    ? subject.topics.reduce((acc, t) =>
        acc + t.subTopics.filter(st => progress.completedSubTopics.includes(st.id)).length, 0)
    : 0
  const pct = totalSubTopics > 0 ? Math.round((completedCount / totalSubTopics) * 100) : 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navigation />
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        {/* Header */}
        <div className={`bg-gradient-to-r ${subject.gradient} pt-6 pb-8 px-6`}>
          <div className="max-w-4xl mx-auto">
            <Link href="/subjects" className="inline-flex items-center gap-2 text-white text-opacity-80 font-bold mb-4 hover:text-opacity-100">
              <ChevronLeft className="w-4 h-4" />
              All Subjects
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-6xl">{subject.emoji}</span>
              <div>
                <h1 className="text-3xl font-black text-white">{subject.title}</h1>
                <p className="text-white text-opacity-80 font-semibold">{subject.description}</p>
              </div>
            </div>
            <div className="mt-4 bg-white bg-opacity-20 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-bold">{completedCount}/{totalSubTopics} lessons</span>
                <span className="text-white font-bold">{pct}% complete</span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                <div className="h-3 bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="font-black text-gray-800 text-xl mb-4">📖 Topics</h2>

          <div className="space-y-4">
            {subject.topics.map((topic, topicIdx) => {
              const topicCompleted = progress
                ? topic.subTopics.filter(st => progress.completedSubTopics.includes(st.id)).length
                : 0
              const isExpanded = expandedTopic === topic.id

              return (
                <div key={topic.id} className="bg-white rounded-3xl shadow-md overflow-hidden">
                  {/* Topic header */}
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                  >
                    <span className="text-3xl">{topic.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-black text-gray-800 text-lg">{topic.title}</h3>
                      <p className="text-gray-500 text-sm font-semibold">{topic.description}</p>
                      <p className="text-xs text-blue-600 font-bold mt-1">
                        {topicCompleted}/{topic.subTopics.length} completed
                      </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  {/* Sub-topics list */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {topic.subTopics.map((subTopic, stIdx) => {
                        const isCompleted = progress?.completedSubTopics.includes(subTopic.id)
                        const score = progress?.quizScores[subTopic.id]
                        const stars = progress?.stars[subTopic.id] || 0
                        const isLocked = topicIdx > 0 && stIdx === 0 && topicCompleted === 0

                        return (
                          <Link
                            key={subTopic.id}
                            href={isLocked ? '#' : `/subjects/${subject.id}/${topic.id}/${subTopic.id}`}
                            className={`flex items-center gap-4 px-6 py-4 hover:bg-blue-50 transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${
                              isCompleted
                                ? 'bg-green-100'
                                : isLocked
                                ? 'bg-gray-100'
                                : 'bg-blue-100'
                            }`}>
                              {isLocked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                              ) : isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                subTopic.emoji
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-800 truncate">{subTopic.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                                  <Clock className="w-3 h-3" />
                                  {subTopic.duration} min
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500 font-semibold">
                                  {'⭐'.repeat(subTopic.difficulty)}{'☆'.repeat(3 - subTopic.difficulty)} difficulty
                                </span>
                                {score !== undefined && (
                                  <>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-green-600 font-bold">Quiz: {score}%</span>
                                  </>
                                )}
                              </div>
                            </div>
                            {stars > 0 && (
                              <div className="flex">
                                {[1,2,3].map(i => (
                                  <Star key={i} className={`w-4 h-4 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                ))}
                              </div>
                            )}
                            {!isLocked && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
