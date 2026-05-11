'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatAssistantProps {
  word: string
  onClose: () => void
}

export default function ChatAssistant({ word, onClose }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `I'm here to help you understand the nuances of "${word}". Ask me anything about its usage, connotations, or context!`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: `That's a great question about "${word}"! The nuance here involves considering the context and formality level. Let me explain...`
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-custom-lg max-w-2xl w-full max-h-[600px] flex flex-col overflow-hidden"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-sand bg-gradient-to-r from-sage/5 to-transparent">
          <div>
            <h3 className="font-serif font-bold text-2xl text-ink flex items-center gap-2">
              <span>🤖</span>
              Nuance Assistant
            </h3>
            <p className="text-sage text-sm mt-1">
              Ask me about "{word}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-sand hover:bg-terracotta/20 transition-all duration-300 flex items-center justify-center group"
          >
            <svg className="w-5 h-5 text-sage group-hover:text-terracotta transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-terracotta to-ochre text-white'
                    : 'bg-sand text-ink'
                }`}>
                  <p className="leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-sand rounded-2xl p-4 flex gap-2">
                <motion.div
                  className="w-2 h-2 bg-sage rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-sage rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-sage rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Input */}
        <div className="p-6 border-t-2 border-sand bg-gradient-to-r from-transparent to-sage/5">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about usage, context, or nuances..."
              className="flex-1 input-field"
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
