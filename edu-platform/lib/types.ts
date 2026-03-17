export interface ContentBlock {
  type: 'text' | 'example' | 'tip' | 'visual' | 'keypoint'
  title?: string
  content: string
  emoji?: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  emoji?: string
}

export interface SubTopic {
  id: string
  title: string
  emoji: string
  description: string
  duration: number // minutes
  difficulty: 1 | 2 | 3
  contentBlocks: ContentBlock[]
  quiz: QuizQuestion[]
  funFact?: string
  videoKeyword?: string // for YouTube search
  imageUrl?: string
}

export interface Subject {
  id: string
  title: string
  emoji: string
  description: string
  colorClass: string
  gradient: string
  topics: Topic[]
}

export interface Topic {
  id: string
  title: string
  emoji: string
  description: string
  subTopics: SubTopic[]
}

export interface UserProgress {
  completedSubTopics: string[]
  quizScores: Record<string, number>
  stars: Record<string, number>
  streakDays: number
  lastActive: string
  totalPoints: number
  badges: string[]
  currentLevel: number
  focusSessions: number
}

export interface AccessibilitySettings {
  theme: 'light' | 'dark' | 'warm' | 'ocean'
  fontSize: 'normal' | 'large' | 'xlarge'
  font: 'normal' | 'dyslexic'
  contrast: 'normal' | 'high'
  reducedMotion: boolean
  ttsEnabled: boolean
  ttsSpeed: number
  ttsPitch: number
}
