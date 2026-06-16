import { cn } from '@/lib/utils'

const linkClass = cn('text-[13px] font-medium text-muted hover:text-foreground transition-colors duration-300')

const socialLinks = [
  {
    label: 'Instagram',
    href: '#',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: '#',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
]

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'SEO', href: '#services' },
      { label: 'Paid Advertising', href: '#services' },
      { label: 'Social Media', href: '#services' },
      { label: 'Web Development', href: '#services' },
      { label: 'Content Marketing', href: '#services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#story' },
      { label: 'Our Work', href: '#work' },
      { label: 'Services', href: '#services' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '#' },
      { label: 'Shipping', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Size Guide', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container-luxury px-6 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
            <span className="font-serif text-xl tracking-wide text-foreground font-bold">
              DigitalGuram
            </span>
            <p className="mt-4 text-sm font-medium text-muted leading-relaxed max-w-xs">
              Crafting exclusive digital experiences at the intersection of artistry and innovation.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-muted hover:text-foreground transition-colors duration-300"
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground mb-5">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] font-medium text-muted">
            &copy; 2024 DigitalGuram. All rights reserved.
          </p>
          <span className="text-[13px] font-medium text-muted">
            India
          </span>
        </div>
      </div>
    </footer>
  )
}
