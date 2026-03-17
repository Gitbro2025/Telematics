'use client'

import { useState, useEffect, useCallback } from 'react'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'
import { getSettings } from '@/lib/progress'

interface Props {
  text: string
  autoPlay?: boolean
}

export default function TextToSpeech({ text, autoPlay = false }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported('speechSynthesis' in window)
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (autoPlay && supported) {
      const settings = getSettings()
      if (settings.ttsEnabled) {
        speak()
      }
    }
  }, [autoPlay, supported, text])

  const speak = useCallback(() => {
    if (!supported) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const settings = getSettings()
    utterance.rate = settings.ttsSpeed || 0.9
    utterance.pitch = settings.ttsPitch || 1.0
    utterance.volume = 1

    // Try to use a friendly voice
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.lang === 'en-US')
    if (preferred) utterance.voice = preferred

    utterance.onstart = () => { setSpeaking(true); setPaused(false) }
    utterance.onend = () => { setSpeaking(false); setPaused(false) }
    utterance.onerror = () => { setSpeaking(false); setPaused(false) }
    utterance.onpause = () => setPaused(true)
    utterance.onresume = () => setPaused(false)

    window.speechSynthesis.speak(utterance)
  }, [text, supported])

  const stop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }

  const togglePause = () => {
    if (paused) {
      window.speechSynthesis.resume()
      setPaused(false)
    } else {
      window.speechSynthesis.pause()
      setPaused(true)
    }
  }

  if (!supported) return null

  return (
    <div className="flex items-center gap-2">
      {!speaking ? (
        <button
          onClick={speak}
          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-2 px-3 rounded-xl text-sm transition-all hover:scale-105"
          title="Read aloud"
        >
          <Volume2 className="w-4 h-4" />
          <span>Read</span>
        </button>
      ) : (
        <>
          <button
            onClick={togglePause}
            className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-2 px-3 rounded-xl text-sm transition-all hover:scale-105"
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{paused ? 'Resume' : 'Pause'}</span>
          </button>
          <button
            onClick={stop}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-3 rounded-xl text-sm transition-all hover:scale-105"
          >
            <VolumeX className="w-4 h-4" />
            <span>Stop</span>
          </button>
        </>
      )}
    </div>
  )
}
