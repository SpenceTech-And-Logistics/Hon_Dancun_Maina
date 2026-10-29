import { useCallback, useEffect, useRef, useState } from 'react'
import { formatDate } from '../lib/media.js'

/**
 * Rotating featured stories. Shows one story at a time and moves on every few seconds.
 * Pauses while the pointer or keyboard focus is on it, and stays still for reduced-motion visitors.
 */
export default function NewsSlider({ items, interval = 6000 }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)
  const n = items.length
  const go = useCallback((k) => setI(((k % n) + n) % n), [n])

  useEffect(() => {
    if (n < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    timer.current = setTimeout(() => setI((x) => (x + 1) % n), interval)
    return () => clearTimeout(timer.current)
  }, [i, n, paused, interval])

  if (!n) return null
  const cur = Math.min(i, n - 1)
  const meta = (s) => [s.outlet, formatDate(s.date)].filter(Boolean).join(' · ')

  return (
    <section
      className="nslide"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(cur + 1)
        if (e.key === 'ArrowLeft') go(cur - 1)
      }}
    >
      <div className="nslide-track">
        {items.map((s, k) => (
          <article
            key={s.id || k}
            className={`nslide-item${k === cur ? ' on' : ''}`}
            aria-roledescription="slide"
            aria-label={`${k + 1} of ${n}`}
            aria-hidden={k !== cur}
          >
            <div className="nslide-img">
              {s.image ? <img src={s.image} alt="" loading={k === 0 ? 'eager' : 'lazy'} /> : <div className="img-fallback">DM</div>}
            </div>
            <div className="nslide-body">
              <span className="eyebrow">{s.category || 'Featured'}</span>
              <span className="meta">{meta(s)}</span>
              <h2>{s.title}</h2>
              {s.summary && <p className="muted">{s.summary}</p>}
              {s.url && (
                <a href={s.url} target="_blank" rel="noreferrer" className="link-arrow" tabIndex={k === cur ? 0 : -1}>
                  Read the story <span>→</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      {n > 1 && (
        <div className="nslide-nav">
          <button type="button" className="nslide-arrow" onClick={() => go(cur - 1)} aria-label="Previous story">←</button>
          <div className="nslide-dots" role="group" aria-label="Choose a story">
            {items.map((s, k) => (
              <button key={s.id || k} type="button" aria-label={`Story ${k + 1}`} aria-current={k === cur} onClick={() => go(k)}>
                {k === cur && !paused && <i style={{ animationDuration: `${interval}ms` }} key={cur} />}
              </button>
            ))}
          </div>
          <button type="button" className="nslide-arrow" onClick={() => go(cur + 1)} aria-label="Next story">→</button>
        </div>
      )}
    </section>
  )
}
