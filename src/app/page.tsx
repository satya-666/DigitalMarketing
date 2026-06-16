import Hero from '@/components/sections/Hero'
import BrandStory from '@/components/sections/BrandStory'
import Services from '@/components/sections/Services'
import Work from '@/components/sections/Work'
import Features from '@/components/sections/Features'
import Banner from '@/components/sections/Banner'
import Newsletter from '@/components/sections/Newsletter'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <BrandStory />
      <Services />
      <Work />
      <Features />
      <Banner />
      <Newsletter />
      <Footer />
    </main>
  )
}
