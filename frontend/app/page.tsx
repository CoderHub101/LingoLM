'use client'
import { apiClient } from '@/lib/api'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navigation from '@/components/Navigation'
import VocabularyCard from '@/components/VocabularyCard'
import ChatAssistant from '@/components/ChatAssistant'

export default function LookupPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showChat, setShowChat] = useState(false)
  
const languageCodes: Record<string, string> = {
  'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Italian': 'it',
  'Portuguese': 'pt', 'Japanese': 'ja', 'Korean': 'ko', 'Mandarin': 'zh'
}

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    try {
      const data = await apiClient.lookup({ lang: languageCodes[selectedLanguage], lemma: searchQuery.trim() })
      const card = data.card
      setSearchResult({
        word: card.lemma || searchQuery,
        language: selectedLanguage,
        partOfSpeech: card.partOfSpeech,
        definitions: [card.shortDefinition],
        examples: card.examples.map((e: { src: string; tgt: string }) => ({ src: e.src, tgt: e.tgt })),
        relatedWords: card.relatedWords || []
      })
    } catch {
      alert('Word not found. Try another word.')
    } finally {
      setIsSearching(false)
    }
  }  
  const handleSave = () => {
    alert('Card saved to your collection!')
  }
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-terracotta via-ochre to-sage rounded-3xl rotate-3 shadow-custom-lg flex items-center justify-center">
                <span className="text-4xl">🔍</span>
              </div>
            </motion.div>
            
            <h1 className="font-serif font-black text-6xl md:text-7xl text-ink mb-4 tracking-tight text-balance">
              Master Every Word
            </h1>
            <p className="text-xl text-sage max-w-2xl mx-auto leading-relaxed">
              Search any vocabulary word and get instant, comprehensive notes with definitions, examples, and context—auto-populated by AI.
            </p>
          </motion.div>
          
          {/* Search Section */}
          <motion.div
            className="bg-white rounded-3xl p-8 shadow-custom-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Language Selector */}
            <div className="mb-6">
              <label className="block font-serif font-bold text-lg text-ink mb-3">
                Select Language
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(languageCodes).map((lang) => (
                  <motion.button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
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
            
            {/* Search Input */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter a word to look up..."
                  className="input-field pl-12 text-lg"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <motion.button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim() || !selectedLanguage}
                className="btn-primary text-lg px-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSearching ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Searching...
                  </>
                ) : (
                  <>
                    Search
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>
            
            {/* Quick Tips */}
            <motion.div
              className="mt-6 pt-6 border-t border-sand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-sage flex items-center gap-2">
                <span>💡</span>
                <span>
                  <strong>Tip:</strong> After searching, you can ask our AI assistant about nuances, usage patterns, and contextual differences.
                </span>
              </p>
            </motion.div>
          </motion.div>
          
          {/* Search Results */}
          <AnimatePresence mode="wait">
            {searchResult && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
              >
                <VocabularyCard
                  word={searchResult.word}
                  language={searchResult.language}
                  definitions={searchResult.definitions}
                  examples={searchResult.examples}
                  relatedWords={searchResult.relatedWords}
                  partOfSpeech={searchResult.partOfSpeech}
                  onSave={handleSave}
                />
                
                {/* Action Buttons */}
                <motion.div
                  className="flex justify-center gap-4 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.button
                    onClick={() => setShowChat(true)}
                    className="btn-secondary flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Ask About Nuances
                  </motion.button>
                  
                  <motion.button
                    onClick={() => setSearchResult(null)}
                    className="px-6 py-3 rounded-full font-medium border-2 border-sand text-sage hover:border-sage hover:bg-sage hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    New Search
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Empty State */}
          {!searchResult && !isSearching && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-32 h-32 bg-gradient-to-br from-sand to-transparent rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <h3 className="font-serif font-bold text-3xl text-ink mb-3">
                Ready to explore?
              </h3>
              <p className="text-sage text-lg max-w-md mx-auto">
                Enter a word above to get started with your vocabulary mastery journey.
              </p>
            </motion.div>
          )}
        </div>
      </main>
      
      {/* Chat Assistant Modal */}
      <AnimatePresence>
        {showChat && searchResult && (
          <ChatAssistant
            word={searchResult.word}
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
