'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getProgress, getLevelTitle } from '@/lib/progress'
import { UserProgress } from '@/lib/types'
import {
  Home, BookOpen, BarChart2, Bot, Settings, Star, Zap, Menu, X
} from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Home', emoji: '🏠' },
  { href: '/subjects', icon: BookOpen, label: 'Subjects', emoji: '📚' },
  { href: '/progress', icon: BarChart2, label: 'My Progress', emoji: '⭐' },
  { href: '/ai-tutor', icon: Bot, label: 'AI Tutor', emoji: '🤖' },
  { href: '/settings', icon: Settings, label: 'Settings', emoji: '⚙️' },
]

export default function Navigation() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setProgress(getProgress())
  }, [pathname])

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 py-6 px-4">
        {/* Logo */}
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            LearnSmart
          </h1>
          <p className="text-xs text-gray-500 font-semibold">Grade 6 Learning Platform</p>
        </div>

        {/* Level badge */}
        {progress && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-gray-600">Level {progress.currentLevel}</span>
            </div>
            <p className="text-sm font-black text-gray-800 mb-2">
              {getLevelTitle(progress.currentLevel)}
            </p>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-bold text-orange-600">{progress.totalPoints} pts</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-bold text-red-500">🔥 {progress.streakDays} day streak</span>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div className="flex flex-col gap-2 flex-1">
          {navItems.map(({ href, label, emoji }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-105'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:scale-105'
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <span>{label}</span>
                {isActive && <span className="ml-auto w-2 h-2 bg-white rounded-full" />}
              </Link>
            )
          })}
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          CAPS & IEB Grade 6 Curriculum
        </p>
      </nav>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          LearnSmart 🎓
        </h1>
        {progress && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-orange-600">🔥 {progress.streakDays}</span>
            <span className="font-bold text-yellow-600">⭐ {progress.totalPoints}</span>
          </div>
        )}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-blue-50 text-blue-600"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl py-20 px-4"
            onClick={e => e.stopPropagation()}
          >
            {navItems.map(({ href, label, emoji }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all mb-2 text-lg ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ href, emoji, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive ? 'bg-blue-50 scale-110' : ''
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <span className={`text-xs font-bold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
