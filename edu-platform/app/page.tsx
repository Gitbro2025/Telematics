'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { getProgress, getLevelTitle, getPointsToNextLevel, BADGE_INFO } from '@/lib/progress'
import { curriculum } from '@/lib/curriculum'
import { UserProgress } from '@/lib/types'
import { Star, Zap, BookOpen, ArrowRight, Trophy, Target, Clock, Flame } from 'lucide-react'

const MOTIVATIONAL_MESSAGES = [
  "You're doing amazing! Keep going! 🌟",
  "Every expert was once a beginner! 💪",
  "Your brain is growing with every lesson! 🧠",
  "Small steps lead to big achievements! 🚀",
  "Learning is a superpower! ⚡",
  "You've got this! We believe in you! 🦁",
  "Mistakes are proof that you are trying! 🎯",
]

export default function HomePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [greeting, setGreeting] = useState('')
  const [motivation, setMotivation] = useState('')

  useEffect(() => {
    setProgress(getProgress())
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
    setMotivation(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])
  }, [])

  const levelProgress = progress ? getPointsToNextLevel(progress.totalPoints) : null
  const recentBadges = progress ? progress.badges.slice(-3) : []
  const completionPercent = progress
    ? Math.round((progress.completedSubTopics.length / 40) * 100)
    : 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navigation />
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">

          {/* Hero greeting */}
          <div className="mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 text-8xl opacity-20 pointer-events-none select-none">🎓</div>
            <h1 className="text-2xl lg:text-4xl font-black mb-2">
              {greeting}! 👋
            </h1>
            <p className="text-blue-100 font-semibold text-lg mb-4">{motivation}</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white bg-opacity-20 rounded-2xl px-4 py-2 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="font-black">{progress?.streakDays || 0} Day Streak</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-2xl px-4 py-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span className="font-black">{progress?.totalPoints || 0} Points</span>
              </div>
              <div className="bg-white bg-opacity-20 rounded-2xl px-4 py-2 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="font-black">Level {progress?.currentLevel || 1}</span>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-3xl p-4 shadow-md text-center">
              <div className="text-3xl font-black text-blue-600">{progress?.completedSubTopics.length || 0}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">Lessons Done ✅</div>
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-md text-center">
              <div className="text-3xl font-black text-purple-600">{progress?.badges.length || 0}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">Badges Earned 🏅</div>
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-md text-center">
              <div className="text-3xl font-black text-green-600">{completionPercent}%</div>
              <div className="text-xs font-bold text-gray-500 mt-1">Overall Progress 📈</div>
            </div>
            <div className="bg-white rounded-3xl p-4 shadow-md text-center">
              <div className="text-3xl font-black text-orange-600">{progress?.focusSessions || 0}</div>
              <div className="text-xs font-bold text-gray-500 mt-1">Focus Sessions 🎯</div>
            </div>
          </div>

          {/* Level progress bar */}
          {levelProgress && progress && (
            <div className="bg-white rounded-3xl p-6 shadow-md mb-8">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-black text-gray-800 text-lg">
                    {getLevelTitle(progress.currentLevel)}
                  </h3>
                  <p className="text-sm text-gray-500 font-semibold">Level {progress.currentLevel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">
                    {levelProgress.current} / {levelProgress.next} pts
                  </p>
                  <p className="text-xs text-gray-400">to next level</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000"
                  style={{ width: `${levelProgress.percent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">{levelProgress.percent}% to Level {progress.currentLevel + 1}</p>
            </div>
          )}

          {/* Recent badges */}
          {recentBadges.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-md mb-8">
              <h2 className="font-black text-gray-800 text-xl mb-4">Recent Badges 🏆</h2>
              <div className="flex gap-4 flex-wrap">
                {recentBadges.map(badge => {
                  const info = BADGE_INFO[badge]
                  if (!info) return null
                  return (
                    <div key={badge} className="flex items-center gap-3 bg-yellow-50 border-2 border-yellow-200 rounded-2xl px-4 py-3">
                      <span className="text-3xl">{info.emoji}</span>
                      <div>
                        <p className="font-black text-gray-800 text-sm">{info.label}</p>
                        <p className="text-xs text-gray-500">{info.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/subjects" className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-6 text-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200">
              <BookOpen className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-black text-xl mb-1">Start Learning</h3>
              <p className="text-blue-100 text-sm font-semibold">Browse all subjects</p>
              <ArrowRight className="w-5 h-5 mt-3 opacity-80" />
            </Link>
            <Link href="/ai-tutor" className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl p-6 text-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200">
              <span className="text-3xl mb-3 block">🤖</span>
              <h3 className="font-black text-xl mb-1">Ask AI Tutor</h3>
              <p className="text-purple-100 text-sm font-semibold">Get help with anything</p>
              <ArrowRight className="w-5 h-5 mt-3 opacity-80" />
            </Link>
            <Link href="/progress" className="bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl p-6 text-white shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200">
              <Target className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-black text-xl mb-1">My Progress</h3>
              <p className="text-green-100 text-sm font-semibold">See what you've achieved</p>
              <ArrowRight className="w-5 h-5 mt-3 opacity-80" />
            </Link>
          </div>

          {/* Subject overview */}
          <h2 className="font-black text-gray-800 text-2xl mb-4">📚 All Subjects</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {curriculum.map(subject => {
              const totalSubTopics = subject.topics.reduce((acc, t) => acc + t.subTopics.length, 0)
              const completedCount = progress
                ? subject.topics.reduce((acc, t) =>
                    acc + t.subTopics.filter(st => progress.completedSubTopics.includes(st.id)).length, 0)
                : 0
              const pct = totalSubTopics > 0 ? Math.round((completedCount / totalSubTopics) * 100) : 0

              return (
                <Link
                  key={subject.id}
                  href={`/subjects/${subject.id}`}
                  className="bg-white rounded-3xl p-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl ${subject.colorClass} flex items-center justify-center text-2xl mx-auto mb-3 shadow-md`}>
                    {subject.emoji}
                  </div>
                  <h3 className="font-black text-gray-800 text-sm mb-2 leading-tight">{subject.title}</h3>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${subject.gradient}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-semibold">{completedCount}/{totalSubTopics} done</p>
                </Link>
              )
            })}
          </div>

          {/* Daily tip */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-6">
            <h3 className="font-black text-gray-800 text-lg mb-2">💡 Study Tip of the Day</h3>
            <p className="text-gray-700 font-semibold">
              Try the <strong>Pomodoro Technique</strong>: Study for 25 minutes, then take a 5-minute break.
              Your brain learns better in short bursts! Use the Focus Timer in each lesson. 🍅
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
