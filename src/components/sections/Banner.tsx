'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.25, 0.1, 0, 1] as const,
    },
  },
}

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: 'easeOut' as const,
    },
  },
}

export default function Banner() {
  return (
    <section className="section-padding relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div
        className="absolute inset-0 animate-glow-slow"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(232, 138, 26, 0.15) 0%, transparent 70%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />

      <motion.div
        className="relative z-10 container-luxury flex flex-col items-center text-center px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-2 mb-20">
          <span className="block w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <span className="block w-8 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <span className="font-serif text-7xl sm:text-8xl md:text-9xl leading-none text-primary/10 select-none tracking-[-0.05em]">
            &ldquo;
          </span>
        </motion.div>

        <motion.blockquote variants={itemVariants}>
          <p className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.08] max-w-5xl mx-auto text-balance text-foreground tracking-tight">
            Luxury is in
            <br />
            each detail
          </p>
        </motion.blockquote>

        <motion.div variants={itemVariants} className="mt-10">
          <span className="block w-12 h-[1px] bg-primary/20 mx-auto mb-10" />
          <cite className="font-script text-xl sm:text-2xl md:text-3xl text-primary/60 block not-italic">
            — Gabrielle Chanel
          </cite>
        </motion.div>

        <motion.div
          variants={fadeVariants}
          className="mt-20 flex items-center gap-4 text-primary/25"
        >
          <span className="block w-6 h-[1px] bg-primary/20" />
          <span className="text-xs tracking-[0.3em] uppercase font-sans text-muted">
            Essence
          </span>
          <span className="block w-6 h-[1px] bg-primary/20" />
        </motion.div>
      </motion.div>
    </section>
  )
}
