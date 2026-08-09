// Shared card contracts. Canonical BaseCard fields are read-only; UserCard
// separates that identity from content a learner is allowed to change.

export interface Romanization {
  system: string
  value: string
}

export interface Definition {
  id: string
  text: string
  partOfSpeech?: string
  register?: string
  domain?: string
  romanization?: string
}

export interface Example {
  id: string
  source: string
  romanization?: string
  translation: string
  definitionId?: string
}

export interface RelatedWord {
  id: string
  lemma: string
  romanization?: string
  relation?: 'synonym' | 'antonym' | 'related'
}

export interface Collocation {
  id: string
  text: string
  romanization?: string
  translation?: string
}

export interface CardForms {
  simplified?: string
  traditional?: string
  variants?: string[]
}

export interface BaseCard {
  baseCardId: string
  language: string
  lemma: string
  normalizedLemma: string
  forms?: CardForms
  romanization?: Romanization
  definitions: Definition[]
  examples: Example[]
  relatedWords?: RelatedWord[]
  collocations?: Collocation[]
  usageNotes?: string[]
  metadata: {
    schemaVersion: number
    source: string
    sourceVersion?: string
    generatedAt?: string
  }
}

/** The required payload from the word-lookup Lambda endpoint. */
export interface CardLookupResponse {
  card: BaseCard
}

export interface CardAnnotation {
  annotationId: string
  section: 'definition' | 'example' | 'relatedWord' | 'collocation' | 'usageNote'
  targetId?: string
  text: string
  createdAt: string
  updatedAt: string
}

export interface UserCardContent {
  definitions: Definition[]
  examples: Example[]
  relatedWords?: RelatedWord[]
  collocations?: Collocation[]
  usageNotes?: string[]
}

export interface UserCard {
  userId: string
  cardId: string
  baseRef: {
    baseCardId: string
    schemaVersion: number
    source: string
    sourceVersion?: string
  }
  language: string
  lemma: string
  normalizedLemma: string
  forms?: CardForms
  romanization?: Romanization
  content: UserCardContent
  notes?: {
    general?: string
    annotations?: CardAnnotation[]
  }
  warnings?: string[]
  revision: number
  createdAt: string
  updatedAt: string
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
