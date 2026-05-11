'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface VocabularyCardProps {
  word: string
  language: string
  definitions: string[]
  examples: string[]
  relatedWords: string[]
  partOfSpeech?: string
  onSave?: () => void
  isPreview?: boolean
}

export default function VocabularyCard({
  word,
  language,
  definitions,
  examples,
  relatedWords,
  partOfSpeech,
  onSave,
  isPreview = false
}: VocabularyCardProps) {
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)
  
  return (
    <motion.div
      className="bg-white rounded-3xl p-8 shadow-custom-lg max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-sand">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <motion.h2 
              className="font-serif font-bold text-5xl text-ink tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {word}
            </motion.h2>
            {partOfSpeech && (
              <span className="text-sage text-sm font-medium bg-sand px-3 py-1 rounded-full">
                {partOfSpeech}
              </span>
            )}
          </div>
          <p className="text-sage font-medium text-sm uppercase tracking-wider">
            {language}
          </p>
        </div>
        
        {!isPreview && onSave && (
          <motion.button
            onClick={onSave}
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Card
          </motion.button>
        )}
      </div>
      
      {/* Definitions */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-serif font-bold text-2xl text-ink mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-terracotta/10 rounded-lg flex items-center justify-center">
            <span className="text-terracotta text-lg">📖</span>
          </span>
          Definitions
        </h3>
        <ul className="space-y-3">
          {definitions.map((def, idx) => (
            <motion.li
              key={idx}
              className="flex gap-3 text-ink/80 leading-relaxed"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
            >
              <span className="text-terracotta font-bold font-serif text-lg mt-0.5">
                {idx + 1}.
              </span>
              <span>{def}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      
      {/* Examples */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-serif font-bold text-2xl text-ink mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-ochre/10 rounded-lg flex items-center justify-center">
            <span className="text-ochre text-lg">💬</span>
          </span>
          Example Sentences
        </h3>
        <div className="space-y-4">
          {examples.map((example, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-br from-sand/50 to-transparent p-4 rounded-xl border-l-4 border-ochre"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
            >
              <p className="text-ink/80 italic leading-relaxed">
                "{example}"
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Related Words */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="font-serif font-bold text-2xl text-ink mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-sage/10 rounded-lg flex items-center justify-center">
            <span className="text-sage text-lg">🔗</span>
          </span>
          Related Words
        </h3>
        <div className="flex flex-wrap gap-2">
          {relatedWords.map((word, idx) => (
            <motion.span
              key={idx}
              className="bg-white border-2 border-sage/20 text-sage px-4 py-2 rounded-full font-medium text-sm hover:bg-sage hover:text-white transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </motion.div>
      
      {/* Personal Notes Section */}
      {!isPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-terracotta/5 to-ochre/5 rounded-xl border-2 border-dashed border-terracotta/30 hover:border-terracotta/50 transition-all duration-300"
          >
            <span className="font-serif font-bold text-xl text-ink flex items-center gap-2">
              <span>✍️</span>
              Personal Notes
            </span>
            <motion.svg
              className="w-6 h-6 text-terracotta"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: showNotes ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          
          {showNotes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4"
            >
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your personal insights, mnemonics, or usage notes here..."
                className="w-full min-h-[150px] bg-white border-2 border-sand px-4 py-3 rounded-xl font-sans text-ink placeholder-sage/50 transition-all duration-300 focus:outline-none focus:border-terracotta focus:ring-4 focus:ring-terracotta/10 resize-none"
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
