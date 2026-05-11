// types/vocabulary.ts

export interface VocabularyCard {
  id: string
  word: string
  language: string
  lemma?: string
  partOfSpeech: string
  definitions: string[]
  examples: string[]
  relatedWords: string[]
  patterns?: string[]
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Language {
  code: string
  name: string
  nativeName?: string
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文' },
]
