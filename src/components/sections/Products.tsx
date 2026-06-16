'use client'

import { motion } from 'framer-motion'

const products = [
  { id: '01', name: 'Heritage Timepiece', category: 'Accessories', price: '\u20B945,000', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1974&auto=format&fit=crop' },
  { id: '02', name: 'Crystal Edition', category: 'Limited', price: '\u20B91,20,000', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1974&auto=format&fit=crop', badge: 'Limited' },
  { id: '03', name: 'Artisan Collection', category: 'Home', price: '\u20B928,000', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1974&auto=format&fit=crop' },
  { id: '04', name: 'Signature Scent', category: 'Fragrance', price: '\u20B912,500', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop', badge: 'New' },
  { id: '05', name: 'Luminous Dial', category: 'Accessories', price: '\u20B967,000', image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1974&auto=format&fit=crop' },
  { id: '06', name: 'Velvet Lounge', category: 'Home', price: '\u20B995,000', image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1964&auto=format&fit=crop' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export default function Products() {
  return (
    <section id="products" className="section-padding">
      <div className="container-luxury">
        <div className="text-center mb-16 md:mb-20">
          <span className="font-script text-primary text-2xl md:text-3xl block mb-4">
            Curated Collection
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mb-4">
            Exquisite Selection
          </h2>
          <p className="text-muted text-sm md:text-base max-w-xl mx-auto">
            Discover handpicked luxury pieces, each defined by exceptional artistry
            and timeless elegance.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="card-shine group cursor-pointer rounded-sm"
              variants={cardVariants}
            >
              <div className="relative aspect-[3/4] rounded-sm overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                {product.badge && (
                  <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-foreground/10 backdrop-blur-md text-foreground text-[10px] uppercase tracking-widest font-semibold rounded-sm border border-foreground/10">
                    {product.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-xs uppercase tracking-[0.2em] text-foreground/80 inline-flex items-center gap-2">
                    View Product
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </span>
                </div>
              </div>
              <div className="px-1">
                <span className="text-[11px] uppercase tracking-[0.25em] text-muted block mb-1.5">
                  {product.category}
                </span>
                <h3 className="font-serif text-lg mb-1.5">{product.name}</h3>
                <span className="text-sm text-foreground/70">{product.price}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
