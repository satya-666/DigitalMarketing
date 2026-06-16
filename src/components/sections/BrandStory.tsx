'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'

const storyRows = [
  {
    eyebrow: 'Legacy',
    heading: 'A Tradition of Excellence',
    paragraph:
      'Born from a passion for the extraordinary, DigitalGuram emerged as a sanctuary where digital artistry meets timeless elegance. Every pixel, every interaction, every detail is infused with a philosophy that honors the old-world craftsmanship while embracing the frontier of technology.',
    imageSide: 'left' as const,
  },
  {
    eyebrow: 'Process',
    heading: 'Meticulous by Design',
    paragraph:
      'Our methodology is rooted in patience and precision. We begin not with code, but with contemplation — understanding the soul of a brand before shaping its digital expression. From the first sketch to the final deployment, each phase is a deliberate act of creation, leaving nothing to chance.',
    imageSide: 'right' as const,
  },
  {
    eyebrow: 'Vision',
    heading: 'Beyond the Horizon',
    paragraph:
      'We do not follow trends — we set standards. By weaving together emerging technologies with time-honored design principles, we craft digital experiences that transcend the ordinary. Our work is not merely seen or used; it is felt, remembered, and passed down like heirloom craft.',
    imageSide: 'left' as const,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.25 },
  },
}

const images = [
  'https://images.unsplash.com/photo-1621605815971-fbc98d66510f?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070&auto=format&fit=crop',
]

function ParallaxImage({ index }: { index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className="aspect-[4/5] rounded-2xl overflow-hidden relative group"
    >
      <img
        src={images[index]}
        alt={`Brand story image ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
        <div className="h-px bg-foreground/20 mb-3" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/60 font-sans">
          {['Est. 2024', 'Frame 02', 'Details'][index]}
        </span>
      </div>
    </div>
  )
}

export default function BrandStory() {
  return (
    <section id="story" className="section-padding">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="text-center mb-24 lg:mb-32"
        >
          <span className="font-script text-3xl md:text-4xl lg:text-5xl text-primary block leading-none">
            The art of digital excellence
          </span>
          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-2 leading-[0.9] text-balance">
            Our{' '}
            <span className="text-primary">Craft</span>
          </h2>
          <div className="w-12 h-px bg-primary/40 mx-auto mt-8" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col gap-32 lg:gap-40"
        >
          {storyRows.map((row, i) => {
            const isLeft = row.imageSide === 'left'

            return (
              <motion.div
                key={row.eyebrow}
                variants={containerVariants}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                <div className={isLeft ? '' : 'lg:order-2'}>
                  <motion.div variants={imageVariants}>
                    <ParallaxImage index={i} />
                  </motion.div>
                </div>

                <div className={isLeft ? 'lg:pl-8' : 'lg:pr-8 lg:order-1'}>
                  <motion.div variants={textVariants}>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted font-sans">
                      {row.eyebrow}
                    </span>
                    <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl mt-4 leading-[1.1] text-balance">
                      {row.heading}
                    </h3>
                    <div className="w-8 h-px bg-primary/30 mt-6 mb-6" />
                    <p className="text-muted text-sm md:text-base leading-[1.8] tracking-wide max-w-lg">
                      {row.paragraph}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
