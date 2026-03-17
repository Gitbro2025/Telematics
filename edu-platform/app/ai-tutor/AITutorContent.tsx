'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/Navigation'
import { curriculum } from '@/lib/curriculum'
import { Send, RotateCcw, Lightbulb, BookOpen, Zap } from 'lucide-react'
import TextToSpeech from '@/components/TextToSpeech'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

const QUICK_QUESTIONS = [
  "Can you explain this in a simpler way? 🤔",
  "Can you give me an example? ✏️",
  "Can you make a quiz for me? 🎯",
  "Why is this important? 💡",
  "Can you use a story to explain? 📚",
  "What's a memory trick for this? 🧠",
]

const SUBJECT_STARTERS: Record<string, string[]> = {
  mathematics: ["Help me with fractions 🍕", "Explain place value 🔢", "I'm stuck on patterns 🔄"],
  english: ["Help me with punctuation ✒️", "What's a noun? 👤", "How do I write a story? ✍️"],
  'natural-sciences': ["What is photosynthesis? 🌱", "Tell me about ecosystems 🌍", "How does electricity work? ⚡"],
  'social-sciences': ["Tell me about apartheid 📜", "Help me with maps 🗺️", "What are SA's provinces? 🇿🇦"],
  'life-orientation': ["How do I manage stress? 😊", "What is resilience? 💪", "Help me with healthy eating 🥦"],
}

export default function AITutorContent() {
  const searchParams = useSearchParams()
  const initialSubject = searchParams.get('subject') || ''
  const initialTopic = searchParams.get('topic') || ''

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      id: 'welcome',
      content: initialTopic
        ? `Hi there! 👋 I'm LearnBot, your AI tutor! I see you're learning about **${initialTopic}**. I'm here to help!\n\nWhat would you like to know? You can ask me to:\n- 🔍 Explain something in a simpler way\n- ✏️ Give you more examples\n- 🎯 Make a practice quiz\n- 💡 Share a memory trick\n\nWhat's on your mind? 😊`
        : `Hi there! 👋 I'm **LearnBot**, your personal AI tutor!\n\nI'm here to help you with **any Grade 6 subject** — maths, English, science, history, and more! 🌟\n\nYou can ask me to:\n- 🔍 Explain something you don't understand\n- ✏️ Give you examples\n- 🎯 Create a mini quiz\n- 💡 Share memory tricks\n\nWhat would you like to learn about today? 😊`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState(initialSubject)
  const [streamingText, setStreamingText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMsg: Message = {
      role: 'user',
      content: messageText,
      id: Date.now().toString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    setStreamingText('')

    try {
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          subject: selectedSubject,
          topic: initialTopic,
        }),
      })

      if (!res.ok) throw new Error('API error')
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                fullText += parsed.text
                setStreamingText(fullText)
              }
            } catch {}
          }
        }
      }

      const assistantMsg: Message = {
        role: 'assistant',
        content: fullText,
        id: Date.now().toString(),
      }
      setMessages(prev => [...prev, assistantMsg])
      setStreamingText('')
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "Oops! 😅 I had a little hiccup. Please try again — I'm ready to help! 🌟",
          id: Date.now().toString(),
        },
      ])
      setStreamingText('')
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      id: 'welcome-new',
      content: "Fresh start! 🌟 What would you like to learn about? I'm all ears! 👂"
    }])
    setInput('')
    setStreamingText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const starters = selectedSubject ? SUBJECT_STARTERS[selectedSubject] || [] : []

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navigation />
      <div className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-5 text-white">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-2xl">
                🤖
              </div>
              <div>
                <h1 className="text-xl font-black">LearnBot AI Tutor</h1>
                <p className="text-purple-100 text-sm font-semibold">Ask me anything about your schoolwork!</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl px-3 py-2 text-sm font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              New Chat
            </button>
          </div>
        </div>

        {/* Subject selector */}
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Subject:
              </span>
              <button
                onClick={() => setSelectedSubject('')}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${!selectedSubject ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All
              </button>
              {curriculum.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubject(s.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${selectedSubject === s.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s.emoji} {s.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${msg.role === 'user' ? '' : 'flex items-start gap-3'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 mt-1">
                      🤖
                    </div>
                  )}
                  <div className={`rounded-3xl px-5 py-4 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-tr-sm'
                      : 'bg-white shadow-md rounded-tl-sm'
                  }`}>
                    <div
                      className={`font-semibold text-base leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
                    {msg.role === 'assistant' && (
                      <div className="mt-2">
                        <TextToSpeech text={msg.content.replace(/\*\*/g, '').replace(/#{1,6} /g, '')} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming message */}
            {streamingText && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[85%]">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 mt-1 animate-pulse">
                    🤖
                  </div>
                  <div className="bg-white rounded-3xl rounded-tl-sm px-5 py-4 shadow-md">
                    <div
                      className="font-semibold text-base leading-relaxed text-gray-800"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) }}
                    />
                    <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse rounded ml-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Loading dots */}
            {isLoading && !streamingText && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center text-lg animate-pulse">
                    🤖
                  </div>
                  <div className="bg-white rounded-3xl rounded-tl-sm px-5 py-4 shadow-md">
                    <div className="flex gap-1 items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-100 px-4 py-3">
          <div className="max-w-3xl mx-auto">
            {starters.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Quick starts for {curriculum.find(s => s.id === selectedSubject)?.title}:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {starters.map(q => (
                    <button key={q} onClick={() => sendMessage(q)} disabled={isLoading}
                      className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 flex-wrap mb-3">
              <p className="text-xs font-bold text-gray-500 w-full flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> I can help with:
              </p>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => sendMessage(q)} disabled={isLoading}
                  className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-xl transition-all disabled:opacity-50">
                  {q}
                </button>
              ))}
            </div>

            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here... (press Enter to send)"
                className="flex-1 bg-gray-50 border-2 border-gray-200 focus:border-blue-400 rounded-2xl px-4 py-3 font-semibold text-gray-800 resize-none outline-none transition-colors text-base"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 py-3 px-5"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              🔒 Your conversations are private • Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
