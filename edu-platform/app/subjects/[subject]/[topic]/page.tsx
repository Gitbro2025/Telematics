'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getTopic } from '@/lib/curriculum'

// Redirect to first subtopic, or show the topic page if no subtopics
export default function TopicPage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const topic = getTopic(params.subject as string, params.topic as string)
    if (topic?.subTopics.length) {
      router.replace(`/subjects/${params.subject}/${params.topic}/${topic.subTopics[0].id}`)
    } else {
      router.replace(`/subjects/${params.subject}`)
    }
  }, [params, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">📚</div>
        <p className="text-xl font-bold text-gray-600">Loading lesson...</p>
      </div>
    </div>
  )
}
