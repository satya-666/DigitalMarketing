'use client'

import { motion } from 'framer-motion'

const caseStudies = [
  {
    title: 'E-Commerce Revenue Surge',
    client: 'Luxury Fashion Brand',
    metric: '+340%',
    label: 'Revenue Growth',
    description:
      'A comprehensive SEO, paid ads, and social strategy that transformed a heritage fashion house into a digital powerhouse — scaling from ₹2L to ₹17L in monthly revenue.',
    tags: ['SEO', 'Meta Ads', 'Google Ads'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
  },
  {
    title: 'SEO Market Dominance',
    client: 'Premium Real Estate Group',
    metric: '50+',
    label: 'Keywords Ranked #1',
    description:
      'Strategic local SEO and content architecture that captured prime real estate search territory — delivering 300+ qualified leads per month with zero ad spend.',
    tags: ['SEO', 'Content Marketing', 'Local SEO'],
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Full Brand Transformation',
    client: 'Tech Startup',
    metric: '5x',
    label: 'Organic Traffic Increase',
    description:
      'Complete brand overhaul — from identity and messaging to web experience and content strategy — resulting in industry authority and 5x organic growth.',
    tags: ['Branding', 'Web Development', 'Content'],
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Performance Marketing Win',
    client: 'SaaS Company',
    metric: '4.2x',
    label: 'ROAS Achieved',
    description:
      'Data-driven performance marketing campaign using AI-powered bidding and creative optimization that delivered ₹2.5Cr in attributed revenue.',
    tags: ['Google Ads', 'AI Automation', 'Analytics'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function Work() {
  return (
    <section id="work" className="section-padding">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="font-script text-primary text-2xl md:text-3xl block mb-4">
            Our Work
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            Results That{' '}
            <span className="text-primary">Speak</span>
          </h2>
          <p className="text-muted text-sm md:text-base max-w-xl mx-auto">
            Real campaigns, real data, real growth. Each project is a story of transformation crafted with precision.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col gap-16 md:gap-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {caseStudies.map((study, i) => {
            const isReversed = i % 2 === 1
            return (
              <motion.div
                key={study.title}
                variants={cardVariants}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}
              >
                <div className={isReversed ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] rounded-sm overflow-hidden relative group">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  </div>
                </div>

                <div className={isReversed ? 'lg:order-1' : ''}>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-muted font-sans">
                    {study.client}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl mt-3 mb-6 leading-tight">
                    {study.title}
                  </h3>

                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="font-serif text-5xl md:text-6xl lg:text-7xl text-primary leading-none">
                      {study.metric}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted">
                      {study.label}
                    </span>
                  </div>

                  <p className="text-muted text-sm md:text-base leading-relaxed mb-6">
                    {study.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-border text-muted font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
