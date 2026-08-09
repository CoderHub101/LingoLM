// lib/api.ts
// API utilities for connecting to the backend Lambda functions
import type { BaseCard, CardLookupResponse, UserCard } from '@/types/vocabulary'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export interface LookupParams {
  lang: string
  lemma: string
}

export interface CreateCardParams {
  baseCard: BaseCard
  notes?: string
}

export interface ChatParams {
  word: string
  baseCard: BaseCard
  userEdits?: Partial<UserCard['content']>
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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
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

    return response.json() as Promise<T>
  }

  // GET /cardLookup?lang=&lemma=
  async lookup({ lang, lemma }: LookupParams): Promise<CardLookupResponse> {
    return this.request<CardLookupResponse>(`/cardLookup?lang=${encodeURIComponent(lang)}&lemma=${encodeURIComponent(lemma)}`)
  }

  // GET /allCards (list user cards)
  async getCards(userId: string): Promise<{ cards: UserCard[] }> {
    return this.request<{ cards: UserCard[] }>('/allCards', {
      headers: { 'x-user-id': userId }
    })
  }

  // POST /chatNuance (nuance Q&A for a word/card)
  async chat(params: ChatParams): Promise<{ response: string }> {
    return this.request<{ response: string }>('/chatNuance', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  // DELETE /cards/:cardId
  async deleteCard(cardId: string): Promise<void> {
    return this.request<void>(`/cards/${encodeURIComponent(cardId)}`, {
      method: 'DELETE',
    })
  }

  // POST /cards — create a user-owned card from a BaseCard lookup result.
  async saveCard(params: CreateCardParams): Promise<{ card: UserCard }> {
    return this.request<{ card: UserCard }>('/cards', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  }

  /**
   * Restores user-editable learning content from the referenced BaseCard.
   * The backend preserves cardId, userId, createdAt, and baseRef.
   */
  async resetCard(cardId: string): Promise<{ card: UserCard }> {
    return this.request<{ card: UserCard }>(`/cards/${encodeURIComponent(cardId)}/reset`, {
      method: 'POST',
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
