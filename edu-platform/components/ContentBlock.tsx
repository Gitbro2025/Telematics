'use client'

import { useState } from 'react'
import { ContentBlock as ContentBlockType } from '@/lib/types'
import TextToSpeech from './TextToSpeech'
import { ChevronDown, ChevronUp } from 'lucide-react'

const BLOCK_STYLES: Record<string, { bg: string; border: string; titleColor: string; icon: string }> = {
  keypoint: { bg: 'bg-blue-50', border: 'border-blue-300', titleColor: 'text-blue-800', icon: '💡' },
  text: { bg: 'bg-white', border: 'border-gray-200', titleColor: 'text-gray-800', icon: '📚' },
  example: { bg: 'bg-purple-50', border: 'border-purple-300', titleColor: 'text-purple-800', icon: '✏️' },
  tip: { bg: 'bg-yellow-50', border: 'border-yellow-300', titleColor: 'text-yellow-800', icon: '🎯' },
  visual: { bg: 'bg-green-50', border: 'border-green-300', titleColor: 'text-green-800', icon: '🔍' },
}

interface Props {
  block: ContentBlockType
  index: number
  isRevealed: boolean
  onReveal: () => void
}

export default function ContentBlockComponent({ block, index, isRevealed, onReveal }: Props) {
  const style = BLOCK_STYLES[block.type] || BLOCK_STYLES.text
  const emoji = block.emoji || style.icon

  // Format content: replace \n with actual line breaks
  const lines = block.content.split('\n')

  return (
    <div
      className={`rounded-2xl border-2 ${style.bg} ${style.border} overflow-hidden transition-all duration-500 ${
        isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          {block.title && (
            <h3 className={`font-black text-lg ${style.titleColor}`}>{block.title}</h3>
          )}
        </div>
        <TextToSpeech text={`${block.title || ''}. ${block.content.replace(/\n/g, ' ')}`} />
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`font-semibold text-gray-700 leading-relaxed ${
              line === '' ? 'mb-3' : 'mb-1'
            }`}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {line || '\u00A0'}
          </p>
        ))}
      </div>
    </div>
  )
}
