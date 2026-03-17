'use client'

import './globals.css'
import { useEffect, useState } from 'react'
import { getSettings } from '@/lib/progress'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const settings = getSettings()
    const html = document.documentElement
    html.setAttribute('data-theme', settings.theme)
    html.setAttribute('data-textsize', settings.fontSize)
    html.setAttribute('data-font', settings.font)
    html.setAttribute('data-contrast', settings.contrast)
  }, [])

  return (
    <html lang="en">
      <head>
        <title>LearnSmart — Grade 6 Learning Platform</title>
        <meta name="description" content="A fun, accessible Grade 6 learning platform for CAPS & IEB" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={mounted ? '' : 'opacity-0'}>
        {children}
      </body>
    </html>
  )
}
