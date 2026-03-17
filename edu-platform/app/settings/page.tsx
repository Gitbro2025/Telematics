'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import { getSettings, saveSettings, getProgress, saveProgress } from '@/lib/progress'
import { AccessibilitySettings } from '@/lib/types'
import { Sun, Moon, Palette, Type, Eye, Volume2, Timer, Trash2, CheckCircle } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<AccessibilitySettings | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSettings(getSettings())
  }, [])

  const update = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => {
      if (!prev) return prev
      const updated = { ...prev, [key]: value }
      saveSettings(updated)

      // Apply theme immediately
      const html = document.documentElement
      html.setAttribute('data-theme', updated.theme)
      html.setAttribute('data-textsize', updated.fontSize)
      html.setAttribute('data-font', updated.font)
      html.setAttribute('data-contrast', updated.contrast)

      return updated
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const resetProgress = () => {
    if (confirm('Are you sure? This will reset ALL your progress, badges and points!')) {
      const { defaultProgress } = require('@/lib/progress')
      saveProgress(defaultProgress)
      alert('Progress reset! Start fresh 🌟')
    }
  }

  if (!settings) return null

  const themes = [
    { id: 'light', label: 'Light', emoji: '☀️', desc: 'Bright and clean' },
    { id: 'dark', label: 'Dark', emoji: '🌙', desc: 'Easy on the eyes' },
    { id: 'warm', label: 'Warm', emoji: '🌅', desc: 'Warm yellow tones' },
    { id: 'ocean', label: 'Ocean', emoji: '🌊', desc: 'Cool blue tones' },
  ] as const

  const fontSizes = [
    { id: 'normal', label: 'Normal', size: 'text-sm' },
    { id: 'large', label: 'Large', size: 'text-base' },
    { id: 'xlarge', label: 'Extra Large', size: 'text-lg' },
  ] as const

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navigation />
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6 lg:py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-gray-800 mb-2">⚙️ Settings</h1>
              <p className="text-gray-500 font-semibold">Customise your learning experience</p>
            </div>
            {saved && (
              <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-2xl">
                <CheckCircle className="w-4 h-4" />
                Saved!
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Theme */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="font-black text-gray-800 text-xl mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-500" />
                Colour Theme
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => update('theme', t.id)}
                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                      settings.theme === t.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 scale-105'
                        : 'border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{t.emoji}</div>
                    <div>{t.label}</div>
                    <div className="text-xs text-gray-400 font-normal">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="font-black text-gray-800 text-xl mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-500" />
                Text Size
              </h2>
              <div className="flex gap-3 flex-wrap">
                {fontSizes.map(f => (
                  <button
                    key={f.id}
                    onClick={() => update('fontSize', f.id)}
                    className={`flex-1 p-4 rounded-2xl border-2 font-bold transition-all ${
                      settings.fontSize === f.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    <span className={f.size}>{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="font-black text-gray-800 text-xl mb-4 flex items-center gap-2">
                <span className="text-xl">Aa</span>
                Font Style
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => update('font', 'normal')}
                  className={`flex-1 p-4 rounded-2xl border-2 font-bold transition-all ${
                    settings.font === 'normal'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <div className="font-sans text-lg">Aa Bb Cc</div>
                  <div className="text-sm text-gray-500">Normal Font</div>
                </button>
                <button
                  onClick={() => update('font', 'dyslexic')}
                  className={`flex-1 p-4 rounded-2xl border-2 font-bold transition-all ${
                    settings.font === 'dyslexic'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  <div className="text-lg" style={{ fontFamily: 'Comic Sans MS, cursive', letterSpacing: '0.05em' }}>
                    Aa Bb Cc
                  </div>
                  <div className="text-sm text-gray-500">Dyslexia-Friendly</div>
                </button>
              </div>
            </div>

            {/* Contrast */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="font-black text-gray-800 text-xl mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-500" />
                Contrast
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => update('contrast', 'normal')}
                  className={`flex-1 p-4 rounded-2xl border-2 font-bold transition-all ${
                    settings.contrast === 'normal'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  🌤️ Normal Contrast
                </button>
                <button
                  onClick={() => update('contrast', 'high')}
                  className={`flex-1 p-4 rounded-2xl border-2 font-bold transition-all ${
                    settings.contrast === 'high'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  ☀️ High Contrast
                </button>
              </div>
            </div>

            {/* Text to Speech */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="font-black text-gray-800 text-xl mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-orange-500" />
                Read Aloud (Text to Speech)
              </h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-gray-700">Auto-read content</p>
                  <p className="text-sm text-gray-500">Automatically read new content aloud</p>
                </div>
                <button
                  onClick={() => update('ttsEnabled', !settings.ttsEnabled)}
                  className={`w-14 h-7 rounded-full transition-all relative ${
                    settings.ttsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${
                    settings.ttsEnabled ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-bold text-gray-700 text-sm block mb-2">
                    Speed: {settings.ttsSpeed.toFixed(1)}x
                  </label>
                  <input
                    type="range"
                    min="0.5" max="1.5" step="0.1"
                    value={settings.ttsSpeed}
                    onChange={e => update('ttsSpeed', parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Slower</span>
                    <span>Normal</span>
                    <span>Faster</span>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-gray-700 text-sm block mb-2">
                    Pitch: {settings.ttsPitch.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5" max="1.5" step="0.1"
                    value={settings.ttsPitch}
                    onChange={e => update('ttsPitch', parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Lower</span>
                    <span>Normal</span>
                    <span>Higher</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Motion */}
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <h2 className="font-black text-gray-800 text-xl mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5 text-teal-500" />
                Animations
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-700">Reduce animations</p>
                  <p className="text-sm text-gray-500">Turn off bouncing and moving elements</p>
                </div>
                <button
                  onClick={() => update('reducedMotion', !settings.reducedMotion)}
                  className={`w-14 h-7 rounded-full transition-all relative ${
                    settings.reducedMotion ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${
                    settings.reducedMotion ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-3xl p-6 border-2 border-red-200">
              <h2 className="font-black text-red-700 text-xl mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Reset Progress
              </h2>
              <p className="text-red-600 font-semibold text-sm mb-4">
                ⚠️ This will delete ALL your progress, stars, points, and badges. This cannot be undone!
              </p>
              <button
                onClick={resetProgress}
                className="bg-red-500 hover:bg-red-600 text-white font-black py-3 px-6 rounded-2xl transition-all hover:scale-105"
              >
                Reset All Progress
              </button>
            </div>

            {/* About */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 border-2 border-blue-100 text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h2 className="font-black text-gray-800 text-xl mb-1">LearnSmart</h2>
              <p className="text-gray-600 font-semibold">Grade 6 Education Platform</p>
              <p className="text-gray-500 text-sm mt-1">CAPS & IEB Curriculum • South Africa</p>
              <p className="text-xs text-gray-400 mt-3">Built with ❤️ for neurodivergent learners</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
