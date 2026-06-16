<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# DigitalGuram Website

## Tech Stack
- Next.js 16.2.9 (Turbopack default)
- React 19.2
- TypeScript
- Tailwind CSS v4 (CSS-based config via @theme)
- GSAP + ScrollTrigger
- Framer Motion
- Three.js / React Three Fiber / @react-three/drei
- Lenis (smooth scrolling)
- MongoDB + Mongoose
- Twilio WhatsApp API

## Key Next.js 16 Differences
- `params` is a Promise — must `await params`
- `middleware.ts` renamed to `proxy.ts` and function renamed to `proxy`
- Turbopack is default (no `--turbopack` flag needed)
- `cookies()` and `headers()` from `next/headers` are async
- Route handlers use standard Web API `Request`/`Response.json()`
- Metadata API: `params` and `searchParams` in `generateMetadata` are Promises

## Project Structure
```
src/
  app/
    layout.tsx          — Root layout with fonts, CustomCursor, SmoothScroll
    page.tsx            — Home page composing all sections
    globals.css         — Tailwind v4 theme + global styles
    sitemap.ts
    robots.ts
    api/leads/route.ts  — Lead submission + WhatsApp notification
  components/
    sections/
      Hero.tsx          — Full-screen hero with 3D shapes, text reveal
      About.tsx         — Agency story, CEO spotlight, animated counters
      Services.tsx      — 9 service cards with stagger animation
      CaseStudies.tsx   — Horizontal scroll case studies
      Process.tsx       — Vertical timeline with scroll-trigger animation
      Testimonials.tsx  — Infinite horizontal slider
      Contact.tsx       — Form with validation, API submission
      Footer.tsx
    ui/
      CustomCursor.tsx  — Custom mouse cursor with follower
      Navbar.tsx        — Sticky nav with mobile menu
      MagneticButton.tsx — Magnetic hover effect wrapper
      FloatingShapes.tsx — Three.js floating 3D shapes
      ScrollIndicator.tsx — Animated scroll indicator
      AnimatedCounter.tsx — Scroll-triggered number counter
      SmoothScroll.tsx  — Lenis smooth scroll provider
      TextReveal.tsx
      ParallaxLayer.tsx
  lib/
    mongodb.ts          — MongoDB connection (cached singleton)
    models/Lead.ts      — Mongoose Lead schema
    utils.ts            — cn(), formatNumber()
  types/
    index.ts            — Shared TypeScript interfaces
    global.d.ts
```

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — ESLint

## Environment Variables
```
MONGODB_URI=mongodb://localhost:27017/digitalguram
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=+14155238886
NOTIFICATION_NUMBER=+917542058462
```

## Color Theme
- Background: #050505
- Foreground: #ffffff
- Primary (electric blue): #0066FF
- Secondary (purple): #7C3AED
- Accent (cyan): #00D4FF
- Muted: #999999
- Card: #0a0a0a
- Border: #1a1a2e

## CSS Utilities
- `.gradient-text` — Blue-to-purple gradient text
- `.gradient-border` — Gradient pseudo-border
- `.glass` / `.glass-hover` — Glassmorphism cards
- `.section-padding` — Standard section spacing
- `.container-main` — Max-width 1280px centered container
