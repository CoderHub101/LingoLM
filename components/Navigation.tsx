'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navigation() {
  const pathname = usePathname()
  
  const navItems = [
    { href: '/', label: 'Lookup' },
    { href: '/cards', label: 'Saved Cards' },
  ]
  
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-sand/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-ochre rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-2xl text-ink tracking-tight">
                  LingoLM
                </h1>
                <p className="text-xs text-sage -mt-1">Vocabulary Mastery</p>
              </div>
            </motion.div>
          </Link>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-ink text-cream shadow-md' 
                        : 'text-ink hover:bg-sand'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
