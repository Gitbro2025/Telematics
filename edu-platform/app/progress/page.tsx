'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { getProgress, getLevelTitle, getPointsToNextLevel, BADGE_INFO } from '@/lib/progress'
import { curriculum } from '@/lib/curriculum'
import { UserProgress } from '@/lib/types'
import Link from 'next/link'
import { Star, Trophy, Zap, Flame, Target, BookOpen, Award } from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null)

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  if (!progress) return null

  const levelInfo = getPointsToNextLevel(progress.totalPoints)
  const level = progress.currentLevel

  // Build subject completion data for radar chart
  const radarData = curriculum.map(subject => {
    const total = subject.topics.reduce((acc, t) => acc + t.subTopics.length, 0)
    const completed = subject.topics.reduce((acc, t) =>
      acc + t.subTopics.filter(st => progress.completedSubTopics.includes(st.id)).length, 0)
    return {
      subject: subject.emoji + ' ' + subject.title.split(' ')[0],
      score: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })

  // Quiz scores for bar chart
  const quizData = Object.entries(progress.quizScores).slice(-8).map(([id, score]) => ({
    name: id.split('-')[0],
    score,
  }))

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navigation />
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto px-4 py-6 lg:py-10">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-800 mb-2">⭐ My Progress</h1>
          <p className="text-gray-500 font-semibold mb-8">Track your amazing learning journey!</p>

          {/* Level card */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white mb-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 text-8xl opacity-10 select-none">🦁</div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-3xl">
                {level >= 9 ? '🦁' : level >= 7 ? '🦅' : level >= 5 ? '🦉' : level >= 3 ? '🐱' : '🐣'}
              </div>
              <div>
                <p className="text-blue-100 font-semibold text-sm">Current Level</p>
                <h2 className="text-2xl font-black">{getLevelTitle(level)}</h2>
              </div>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="font-bold text-sm text-blue-100">Level {level}</span>
              <span className="font-bold text-sm text-blue-100">Level {level + 1}</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-4">
              <div
                className="h-4 bg-white rounded-full transition-all duration-1000"
                style={{ width: `${levelInfo.percent}%` }}
              />
            </div>
            <p className="text-blue-100 text-sm font-semibold mt-2">
              {levelInfo.current} / {levelInfo.next} pts to next level
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Lessons Done', value: progress.completedSubTopics.length, emoji: '✅', color: 'text-green-600' },
              { label: 'Total Points', value: progress.totalPoints, emoji: '⭐', color: 'text-yellow-600' },
              { label: 'Day Streak', value: progress.streakDays, emoji: '🔥', color: 'text-orange-600' },
              { label: 'Badges', value: progress.badges.length, emoji: '🏅', color: 'text-purple-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-3xl p-5 shadow-md text-center">
                <div className="text-3xl mb-1">{stat.emoji}</div>
                <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs font-bold text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Radar chart */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="font-black text-gray-800 text-xl mb-4">📊 Subject Coverage</h2>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <Radar
                    name="Progress"
                    dataKey="score"
                    stroke="#667eea"
                    fill="#667eea"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Quiz scores */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="font-black text-gray-800 text-xl mb-4">📝 Recent Quiz Scores</h2>
              {quizData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={quizData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                    <Bar dataKey="score" fill="url(#colorGrad)" radius={[6, 6, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#667eea" />
                        <stop offset="100%" stopColor="#764ba2" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-center text-gray-400">
                  <div>
                    <p className="text-4xl mb-3">🎯</p>
                    <p className="font-bold">Complete some quizzes to see your scores here!</p>
                    <Link href="/subjects" className="mt-3 inline-block btn-primary text-sm">
                      Start Learning
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-3xl p-6 shadow-md mb-8">
            <h2 className="font-black text-gray-800 text-xl mb-4">🏆 My Badges</h2>
            {progress.badges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {progress.badges.map(badge => {
                  const info = BADGE_INFO[badge]
                  if (!info) return null
                  return (
                    <div key={badge} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-4 text-center">
                      <div className="text-4xl mb-2">{info.emoji}</div>
                      <p className="font-black text-gray-800 text-sm">{info.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p className="text-5xl mb-3">🏅</p>
                <p className="font-bold text-lg">No badges yet — start learning to earn them!</p>
                <Link href="/subjects" className="mt-4 inline-block btn-primary">
                  Start Earning Badges
                </Link>
              </div>
            )}
          </div>

          {/* Badges to earn */}
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="font-black text-gray-800 text-xl mb-4">🎯 Badges to Earn</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(BADGE_INFO)
                .filter(([key]) => !progress.badges.includes(key))
                .map(([key, info]) => (
                  <div key={key} className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-3 text-center opacity-60">
                    <div className="text-3xl mb-1 grayscale">{info.emoji}</div>
                    <p className="font-bold text-gray-600 text-xs">{info.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{info.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
