'use client'

import { motion } from 'framer-motion'

const features = [
  { title: 'Handcrafted Excellence', description: 'Every piece is meticulously crafted by master artisans using time-honored techniques passed down through generations.', icon: '✦' },
  { title: 'Premium Materials', description: 'We source only the finest materials from around the world — rare woods, precious metals, and exceptional fabrics.', icon: '◆' },
  { title: 'Timeless Design', description: 'Our designs transcend trends, creating pieces that remain as relevant and beautiful decades from now as they are today.', icon: '▲' },
  { title: 'Bespoke Service', description: 'Every creation is tailored to your exact specifications, ensuring a truly one-of-a-kind piece that reflects your vision.', icon: '●' },
  { title: 'Sustainable Craft', description: 'We honor the planet with ethical sourcing, zero-waste production, and enduring quality that reduces consumption.', icon: '■' },
  { title: 'Legacy Guarantee', description: 'Each piece carries our lifetime guarantee — a testament to our confidence in its craftsmanship and longevity.', icon: '♦' }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }
  }
}

export default function Features() {
  return (
    <section id="features" className="section-padding">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="mb-20 md:mb-28 text-center"
        >
          <span className="font-script text-primary text-xl md:text-2xl block mb-4">
            Why Choose Us
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.1]">
            Crafted for the <span className="text-primary">Discerning</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative p-8 md:p-10 rounded-sm border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:bg-card/60"
            >
              <span className="block font-serif text-4xl md:text-5xl text-primary/60 group-hover:text-primary group-hover:scale-110 transition-all duration-500 mb-6 leading-none">
                {feature.icon}
              </span>
              <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-foreground/80 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
