'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const scrolled = window.scrollY
      const bg = containerRef.current.querySelector('.hero-bg') as HTMLElement
      const content = containerRef.current.querySelector('.hero-content') as HTMLElement
      if (bg) bg.style.transform = `translateY(${scrolled * 0.4}px)`
      if (content) content.style.transform = `translateY(${scrolled * 0.15}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      <div className="hero-bg absolute inset-0 transition-transform duration-200 ease-out will-change-transform">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background z-10" />
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury abstract background"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      <div className="hero-content absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <span className="font-script text-primary text-2xl md:text-3xl mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          Crafted with Precision
        </span>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] max-w-5xl mx-auto text-balance">
          <span className="block opacity-0 animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            Where
          </span>
          <span className="block opacity-0 animate-slide-up mt-2" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            <span className="text-primary">Craftsmanship</span>
          </span>
          <span className="block opacity-0 animate-slide-up mt-2" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
            Meets Digital
          </span>
        </h1>

        <p className="mt-8 text-sm md:text-base text-muted max-w-xl tracking-wide leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          India&apos;s premier luxury digital agency — crafting exclusive brand experiences through design, technology, and storytelling.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <a
            href="#products"
            className="group relative px-10 py-4 bg-primary text-background font-sans text-xs uppercase tracking-[0.2em] font-semibold overflow-hidden transition-all duration-300 hover:bg-primary-dark"
          >
            <span className="relative z-10">Explore Collection</span>
            <span className="absolute inset-0 bg-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>
          <a
            href="#story"
            className="group px-10 py-4 border border-foreground/20 text-foreground font-sans text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:border-foreground/40 hover:bg-white/5"
          >
            Our Story
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
        <span className="text-[10px] text-muted uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-muted/50 to-transparent" />
      </div>
    </section>
  )
}
