'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Craft', href: '#story' },
  { label: 'Features', href: '#features' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'glass-nav' : 'bg-transparent'
      )}
    >
      <div className="container-luxury flex items-center justify-between px-6 py-6 md:py-7">
        <a href="#" className="text-xl md:text-2xl font-serif tracking-[0.15em] text-foreground uppercase font-bold">
          DigitalGuram
        </a>

        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors duration-300 font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-7">
          <button className="text-muted hover:text-foreground transition-colors" aria-label="Search">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          <button className="text-muted hover:text-foreground transition-colors" aria-label="Account">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </button>
          <button className="text-muted hover:text-foreground transition-colors relative" aria-label="Cart">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full text-[9px] font-sans flex items-center justify-center text-background font-bold">0</span>
          </button>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={cn('block w-6 h-[1.5px] bg-foreground transition-all duration-300', mobileOpen && 'rotate-45 translate-y-[5px]')} />
          <span className={cn('block w-6 h-[1.5px] bg-foreground transition-all duration-300', mobileOpen && 'opacity-0')} />
          <span className={cn('block w-6 h-[1.5px] bg-foreground transition-all duration-300', mobileOpen && '-rotate-45 -translate-y-[5px]')} />
        </button>
      </div>

      <div className={cn(
        'md:hidden fixed inset-0 top-0 bg-background/95 backdrop-blur-xl z-[-1] transition-all duration-500 flex items-center justify-center',
        mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}>
        <div className="flex flex-col items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-2xl font-serif text-muted hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
