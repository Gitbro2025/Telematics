import { UserProgress, AccessibilitySettings } from './types'

const PROGRESS_KEY = 'edu_platform_progress'
const SETTINGS_KEY = 'edu_platform_settings'

export const defaultProgress: UserProgress = {
  completedSubTopics: [],
  quizScores: {},
  stars: {},
  streakDays: 0,
  lastActive: new Date().toISOString(),
  totalPoints: 0,
  badges: [],
  currentLevel: 1,
  focusSessions: 0,
}

export const defaultSettings: AccessibilitySettings = {
  theme: 'light',
  fontSize: 'normal',
  font: 'normal',
  contrast: 'normal',
  reducedMotion: false,
  ttsEnabled: false,
  ttsSpeed: 1.0,
  ttsPitch: 1.0,
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress
  const stored = localStorage.getItem(PROGRESS_KEY)
  if (!stored) return defaultProgress
  try {
    return { ...defaultProgress, ...JSON.parse(stored) }
  } catch {
    return defaultProgress
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function markSubTopicComplete(subTopicId: string, score: number, stars: number): UserProgress {
  const progress = getProgress()
  const today = new Date().toISOString().split('T')[0]
  const lastActiveDate = progress.lastActive?.split('T')[0]

  if (!progress.completedSubTopics.includes(subTopicId)) {
    progress.completedSubTopics.push(subTopicId)
    progress.totalPoints += calculatePoints(score, stars)
  }
  progress.quizScores[subTopicId] = Math.max(progress.quizScores[subTopicId] || 0, score)
  progress.stars[subTopicId] = Math.max(progress.stars[subTopicId] || 0, stars)

  // streak logic
  if (lastActiveDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    if (lastActiveDate === yesterdayStr) {
      progress.streakDays += 1
    } else {
      progress.streakDays = 1
    }
  }
  progress.lastActive = new Date().toISOString()
  progress.currentLevel = calculateLevel(progress.totalPoints)
  progress.badges = calculateBadges(progress)

  saveProgress(progress)
  return progress
}

function calculatePoints(score: number, stars: number): number {
  return Math.round((score / 100) * 50) + stars * 10
}

function calculateLevel(points: number): number {
  if (points < 100) return 1
  if (points < 250) return 2
  if (points < 500) return 3
  if (points < 1000) return 4
  if (points < 2000) return 5
  if (points < 3500) return 6
  if (points < 5000) return 7
  if (points < 7500) return 8
  if (points < 10000) return 9
  return 10
}

export function getLevelTitle(level: number): string {
  const titles = ['', 'Curious Cub 🐣', 'Learning Pup 🐶', 'Knowledge Kat 🐱', 'Smart Fox 🦊',
    'Brilliant Bear 🐻', 'Wise Owl 🦉', 'Super Shark 🦈', 'Eagle Eye 🦅', 'Champion Cheetah 🐆', 'ULTIMATE GENIUS 🦁']
  return titles[level] || 'Legend 🏆'
}

export function getPointsToNextLevel(points: number): { current: number; next: number; percent: number } {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000, Infinity]
  const level = calculateLevel(points)
  const current = thresholds[level - 1]
  const next = thresholds[level]
  const percent = next === Infinity ? 100 : Math.round(((points - current) / (next - current)) * 100)
  return { current: points - current, next: next - current, percent }
}

function calculateBadges(progress: UserProgress): string[] {
  const badges: string[] = []
  if (progress.completedSubTopics.length >= 1) badges.push('first-steps')
  if (progress.completedSubTopics.length >= 5) badges.push('explorer')
  if (progress.completedSubTopics.length >= 10) badges.push('achiever')
  if (progress.completedSubTopics.length >= 25) badges.push('scholar')
  if (progress.streakDays >= 3) badges.push('streak-3')
  if (progress.streakDays >= 7) badges.push('streak-7')
  if (progress.streakDays >= 30) badges.push('streak-30')
  if (Object.values(progress.quizScores).some(s => s === 100)) badges.push('perfect-score')
  if (progress.focusSessions >= 5) badges.push('focused')
  if (progress.totalPoints >= 500) badges.push('power-learner')
  return badges
}

export const BADGE_INFO: Record<string, { label: string; emoji: string; description: string }> = {
  'first-steps': { label: 'First Steps', emoji: '👣', description: 'Completed your first lesson!' },
  'explorer': { label: 'Explorer', emoji: '🗺️', description: 'Completed 5 lessons' },
  'achiever': { label: 'Achiever', emoji: '🎯', description: 'Completed 10 lessons' },
  'scholar': { label: 'Scholar', emoji: '🎓', description: 'Completed 25 lessons' },
  'streak-3': { label: '3-Day Streak', emoji: '🔥', description: 'Studied 3 days in a row!' },
  'streak-7': { label: 'Week Warrior', emoji: '⚡', description: 'Studied 7 days in a row!' },
  'streak-30': { label: 'Month Master', emoji: '🌟', description: 'Studied 30 days in a row!' },
  'perfect-score': { label: 'Perfect Score', emoji: '💯', description: 'Got 100% on a quiz!' },
  'focused': { label: 'Focused', emoji: '🎯', description: 'Completed 5 focus sessions' },
  'power-learner': { label: 'Power Learner', emoji: '💪', description: 'Earned 500 points!' },
}

export function getSettings(): AccessibilitySettings {
  if (typeof window === 'undefined') return defaultSettings
  const stored = localStorage.getItem(SETTINGS_KEY)
  if (!stored) return defaultSettings
  try {
    return { ...defaultSettings, ...JSON.parse(stored) }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: AccessibilitySettings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
