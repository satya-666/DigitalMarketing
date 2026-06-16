'use client'

import { motion } from 'framer-motion'

const services = [
  {
    id: '01',
    title: 'Search Engine Optimization',
    description:
      'Dominate search rankings with data-driven SEO strategies that drive organic growth, increase visibility, and attract qualified traffic.',
    image: 'https://images.unsplash.com/photo-1432889821006-3149402b1c26?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '02',
    title: 'Paid Advertising',
    description:
      'Maximize ROI with precision-targeted campaigns across Google Ads, Meta, LinkedIn, and emerging platforms — engineered for conversions.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '03',
    title: 'Social Media Marketing',
    description:
      'Build communities and drive engagement with creative, platform-native content strategies that amplify your brand voice.',
    image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '04',
    title: 'Web Development',
    description:
      'Custom, high-performance websites engineered for speed, conversion, and brand excellence — from concept to deployment.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2064&auto=format&fit=crop',
  },
  {
    id: '05',
    title: 'Content Marketing',
    description:
      'Strategic content that educates, inspires, and converts — from long-form articles and whitepapers to video production and infographics.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '06',
    title: 'Brand Strategy',
    description:
      'Craft compelling brand identities that resonate deeply with your audience — positioning, messaging, visual identity, and narrative.',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '07',
    title: 'Email Marketing',
    description:
      'Nurture leads and drive revenue with sophisticated email automation, segmentation, and personalized campaign strategies.',
    image: 'https://images.unsplash.com/photo-1557200139-90348f3dfe91?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '08',
    title: 'Analytics & Optimization',
    description:
      'Data-driven insights and continuous optimization to maximize every marketing dollar — dashboards, attribution, and A/B testing.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '09',
    title: 'Lead Generation',
    description:
      'Fill your pipeline with high-quality, sales-ready leads through multi-channel strategies designed for measurable growth.',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export default function Services() {
  return (
    <section id="services" className="section-padding">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="font-script text-primary text-2xl md:text-3xl block mb-4">
            What We Do
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            Digital <span className="text-primary">Excellence</span>
          </h2>
          <p className="text-muted text-sm md:text-base max-w-xl mx-auto">
            End-to-end digital marketing services crafted to grow your brand, drive revenue, and create lasting impact.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              className="group relative rounded-sm overflow-hidden border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:bg-card/60"
              variants={cardVariants}
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>
              <div className="p-6 md:p-8 -mt-16 relative z-10">
                <span className="font-serif text-4xl text-primary/30 block mb-3 leading-none">
                  {service.id}
                </span>
                <h3 className="font-serif text-xl md:text-2xl mb-3">
                  {service.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
