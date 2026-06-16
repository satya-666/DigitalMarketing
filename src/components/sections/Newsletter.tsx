'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('success')
    setEmail('')
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <section className="section-padding bg-card border-t border-border">
      <div className="container-luxury">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <span className="font-script text-primary text-xl md:text-2xl block mb-2">
              Stories of craftsmanship
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight">
              The Journal
            </h2>
            <p className="mt-4 text-muted text-sm md:text-base leading-relaxed max-w-md">
              Discover the narratives behind the world&apos;s finest creations — from
              artisanal techniques to the minds shaping modern luxury.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-5 py-4 bg-background border border-border text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors duration-300 rounded-none text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-background hover:bg-primary-dark transition-colors duration-300 uppercase tracking-widest text-xs font-semibold rounded-none whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-primary text-sm"
              >
                Thank you for subscribing
              </motion.p>
            )}

            <p className="mt-4 text-muted-foreground text-xs tracking-wide">
              No spam. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
