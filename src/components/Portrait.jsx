import { useRef } from 'react'
import { useScroll } from '../lib/hooks.js'
import { useContent } from '../lib/useContent.js'

// Each spot has its own photo, so the home page and the About page do not repeat the same picture.
// Upload them in the dashboard (Profile and career), or drop files into src/assets/images:
//   portrait.jpg   home page, top        (dashboard: "Portrait photo")
//   home-about.jpg home page, About strip (dashboard: "Home page, second photo")
//   about.jpg      About page            (dashboard: "About page photo")
// .png and .webp work too. An empty spot falls back to the main portrait.
const files = import.meta.glob('../assets/images/{portrait,home-about,about}.*', { eager: true, query: '?url', import: 'default' })
const bundled = (name) => Object.entries(files).find(([k]) => k.split('/').pop().split('.')[0] === name)?.[1] || ''

const SLOTS = {
  hero: ['photo', 'portrait'],
  homeAbout: ['homePhoto2', 'home-about'],
  about: ['aboutPhoto', 'about'],
}

export default function Portrait({ className = '', parallax = true, eager = false, slot = 'hero' }) {
  const { profile } = useContent()
  const ref = useRef(null)
  const [field, file] = SLOTS[slot] || SLOTS.hero
  const src = profile[field] || bundled(file) || profile.photo || bundled('portrait')

  useScroll((y) => {
    if (!parallax || !ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ref.current.style.setProperty('--py', `${Math.min(y, 900) * -0.06}px`)
  })

  return (
    <div className={`portrait ${className}`} ref={ref}>
      <div className="portrait-frame" aria-hidden="true" />
      <div className="portrait-card">
        {src ? (
          <img src={src} alt={`Portrait of ${profile.name}`} loading={eager ? 'eager' : 'lazy'} />
        ) : (
          <div className="portrait-mono" role="img" aria-label={`Monogram of ${profile.name}`}>
            <span>DM</span>
            <small>Nyeri Town</small>
          </div>
        )}
      </div>
    </div>
  )
}
