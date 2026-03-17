'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { curriculum } from '@/lib/curriculum'
import { getProgress } from '@/lib/progress'
import { UserProgress } from '@/lib/types'
import { ChevronRight, Clock, BookOpen } from 'lucide-react'

export default function SubjectsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navigation />
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-black text-gray-800 mb-2">📚 All Subjects</h1>
            <p className="text-gray-500 font-semibold">Choose a subject to start learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curriculum.map(subject => {
              const totalSubTopics = subject.topics.reduce((acc, t) => acc + t.subTopics.length, 0)
              const totalDuration = subject.topics.reduce((acc, t) =>
                acc + t.subTopics.reduce((a, st) => a + st.duration, 0), 0)
              const completedCount = progress
                ? subject.topics.reduce((acc, t) =>
                    acc + t.subTopics.filter(st => progress.completedSubTopics.includes(st.id)).length, 0)
                : 0
              const pct = totalSubTopics > 0 ? Math.round((completedCount / totalSubTopics) * 100) : 0

              return (
                <Link
                  key={subject.id}
                  href={`/subjects/${subject.id}`}
                  className="bg-white rounded-3xl shadow-md hover:shadow-xl hover:scale-102 transition-all duration-200 overflow-hidden group"
                >
                  <div className={`h-24 bg-gradient-to-r ${subject.gradient} flex items-center px-6 gap-4`}>
                    <span className="text-5xl">{subject.emoji}</span>
                    <div>
                      <h2 className="text-white font-black text-xl">{subject.title}</h2>
                      <p className="text-white text-opacity-80 text-sm font-semibold">{subject.description}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="p-5">
                    <div className="flex gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                        <BookOpen className="w-4 h-4" />
                        <span>{totalSubTopics} lessons</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                        <Clock className="w-4 h-4" />
                        <span>~{totalDuration} mins</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${subject.gradient} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-gray-600">{pct}%</span>
                    </div>
                    <p className="text-xs text-gray-400 font-semibold mt-1">
                      {completedCount} of {totalSubTopics} lessons completed
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
