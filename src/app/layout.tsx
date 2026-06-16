import type { Metadata } from 'next'
import { Playfair_Display, Inter, Dancing_Script } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/Navbar'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const dancing = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DigitalGuram — Luxury Digital Craftsmanship',
  description:
    'India\'s premier luxury digital agency. We craft exclusive brand experiences through design, technology, and storytelling.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${dancing.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
