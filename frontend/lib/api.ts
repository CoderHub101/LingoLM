// lib/api.ts
// API utilities for connecting to the backend Lambda functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export interface LookupParams {
  lang: string
  lemma: string
}

export interface CreateCardParams {
  lang: string
  lemma: string
  card: any
  notes?: string
}

export interface ChatParams {
  word: string
  baseCard: any
  userEdits?: any
  notes?: string
  question: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // GET /cardLookup?lang=&lemma=
  async lookup({ lang, lemma }: LookupParams) {
    return this.request(`/cardLookup?lang=${lang}&lemma=${encodeURIComponent(lemma)}`)
  }

  // GET /allCards (list user cards)
  async getCards(userId: string) {
    return this.request('/allCards', {
      headers: { 'x-user-id': userId }
    })
  }

  // POST /chat (nuance Q&A for a word/card)
  async chat(params: ChatParams) {
    return this.request('/chatNuance', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  // DELETE /cards/:cardId
  async deleteCard(cardId: string) {
    return this.request(`/cards/${cardId}`, {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

// Mock data for development
export const mockLookup = async (word: string, language: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    word,
    language,
    partOfSpeech: 'verb',
    definitions: [
      'To move or go from one place to another',
      'To make a journey, especially of some length or abroad',
      'To move or proceed in a particular direction'
    ],
    examples: [
      `We plan to ${word} to Europe next summer for three weeks.`,
      `She ${word}s frequently for work, visiting different cities each month.`,
      `Light ${word}s faster than sound through different mediums.`
    ],
    relatedWords: ['journey', 'voyage', 'trip', 'trek', 'wander', 'roam']
  }
}

export const mockChat = async (question: string, word: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  return {
    response: `That's a great question about "${word}"! The nuance here involves considering the context and formality level. This word carries specific connotations that vary based on the situation.`
  }
}
