import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LingoLM — Master Language Vocabulary',
  description: 'AI-powered vocabulary learning platform that auto-populates customizable notes with definitions, examples, and context.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
