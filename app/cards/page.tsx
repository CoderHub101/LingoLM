'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/Navigation'
import VocabularyCard from '@/components/VocabularyCard'

interface SavedCard {
  id: string
  word: string
  language: string
  definitions: string[]
  examples: string[]
  relatedWords: string[]
  partOfSpeech: string
  notes: string
  tags: string[]
  createdAt: string
}

export default function SavedCardsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('All')
  const [selectedCard, setSelectedCard] = useState<SavedCard | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Mock data
  const savedCards: SavedCard[] = [
    {
      id: '1',
      word: 'viajar',
      language: 'Spanish',
      partOfSpeech: 'verb',
      definitions: [
        'To travel or journey',
        'To move from one place to another',
        'To go on a trip'
      ],
      examples: [
        'Me gusta viajar por el mundo.',
        'Vamos a viajar a España el próximo verano.',
        'Ella viaja mucho por su trabajo.'
      ],
      relatedWords: ['viaje', 'viajero', 'travesía', 'recorrer'],
      notes: 'Remember: irregular conjugation in present tense. Similar to English "voyage".',
      tags: ['travel', 'intermediate', 'common'],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      word: 'épanouir',
      language: 'French',
      partOfSpeech: 'verb',
      definitions: [
        'To blossom or flourish',
        'To develop fully',
        'To thrive emotionally or personally'
      ],
      examples: [
        "Les fleurs s'épanouissent au printemps.",
        "Elle s'épanouit dans son nouveau travail.",
        'Un enfant a besoin de temps pour s\'épanouir.'
      ],
      relatedWords: ['épanouissement', 'fleurir', 'développer', 'prospérer'],
      notes: 'Beautiful word with no direct English equivalent. Used both literally (flowers) and figuratively (personal growth).',
      tags: ['nature', 'personal-growth', 'advanced'],
      createdAt: '2024-01-18'
    },
    {
      id: '3',
      word: 'Heimweh',
      language: 'German',
      partOfSpeech: 'noun',
      definitions: [
        'Homesickness',
        'Longing for home',
        'Nostalgia for one\'s homeland'
      ],
      examples: [
        'Nach drei Monaten im Ausland bekam er Heimweh.',
        'Heimweh ist ein Gefühl, das viele Reisende kennen.',
        'Sie litt unter starkem Heimweh.'
      ],
      relatedWords: ['Fernweh', 'Sehnsucht', 'Nostalgie'],
      notes: 'Compound word: Heim (home) + Weh (pain). Contrast with Fernweh (wanderlust).',
      tags: ['emotions', 'travel', 'compound-words'],
      createdAt: '2024-01-20'
    }
  ]
  
  const languages = ['All', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Japanese']
  
  const filteredCards = savedCards.filter(card => {
    const matchesSearch = card.word.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLanguage = selectedLanguage === 'All' || card.language === selectedLanguage
    return matchesSearch && matchesLanguage
  })
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="font-serif font-black text-6xl text-ink mb-3 tracking-tight">
                  Your Collection
                </h1>
                <p className="text-xl text-sage">
                  {savedCards.length} cards saved • Keep building your knowledge base
                </p>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-ink text-cream' : 'bg-sand text-sage hover:bg-sage/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-ink text-cream' : 'bg-sand text-sage hover:bg-sage/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </motion.button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="bg-white rounded-3xl p-6 shadow-custom">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your cards..."
                    className="input-field pl-12"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Language Filter */}
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                        selectedLanguage === lang
                          ? 'bg-gradient-to-r from-terracotta to-ochre text-white shadow-md'
                          : 'bg-sand text-sage hover:bg-sage/20'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {lang}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Cards Grid/List */}
          {filteredCards.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredCards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedCard(card)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-custom hover:shadow-custom-lg transition-all duration-300 h-full">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-sand">
                      <div className="flex-1">
                        <h3 className="font-serif font-bold text-3xl text-ink mb-1">
                          {card.word}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-sage font-medium bg-sand px-2 py-1 rounded-full">
                            {card.language}
                          </span>
                          <span className="text-xs text-sage font-medium bg-sand px-2 py-1 rounded-full">
                            {card.partOfSpeech}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-terracotta/10 to-ochre/10 rounded-xl flex items-center justify-center group-hover:from-terracotta group-hover:to-ochre transition-all duration-300"
                        whileHover={{ rotate: 12 }}
                      >
                        <svg className="w-5 h-5 text-terracotta group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                    
                    {/* Preview */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm font-medium text-sage mb-1">Definition</p>
                        <p className="text-ink/80 text-sm line-clamp-2">
                          {card.definitions[0]}
                        </p>
                      </div>
                      
                      {card.notes && (
                        <div>
                          <p className="text-sm font-medium text-sage mb-1 flex items-center gap-1">
                            <span>✍️</span> Your Notes
                          </p>
                          <p className="text-ink/70 text-sm italic line-clamp-2 bg-sand/30 p-2 rounded-lg">
                            {card.notes}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-sage/70 bg-sage/10 px-2 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Date */}
                    <div className="mt-4 pt-4 border-t border-sand">
                      <p className="text-xs text-sage">
                        Added {new Date(card.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-sand to-transparent rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-6xl">🔍</span>
              </div>
              <h3 className="font-serif font-bold text-3xl text-ink mb-3">
                No cards found
              </h3>
              <p className="text-sage text-lg">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          )}
        </div>
      </main>
      
      {/* Card Detail Modal */}
      {selectedCard && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedCard(null)}
        >
          <motion.div
            className="my-8"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedCard(null)}
                className="w-12 h-12 rounded-full bg-white hover:bg-sand transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <VocabularyCard
              word={selectedCard.word}
              language={selectedCard.language}
              definitions={selectedCard.definitions}
              examples={selectedCard.examples}
              relatedWords={selectedCard.relatedWords}
              partOfSpeech={selectedCard.partOfSpeech}
              isPreview
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
