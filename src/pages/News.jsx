import { useState } from 'react'
import PageHead from '../components/PageHead.jsx'
import NewsSlider from '../components/NewsSlider.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { formatDate } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'

export default function News() {
  const { press } = useContent()
  const [cat, setCat] = useState('All')
  const cats = ['All', ...new Set(press.map((n) => n.category).filter(Boolean))]
  const shown = cat === 'All' ? press : press.filter((n) => n.category === cat)
  const [active, setActive] = useState(0)
  const meta = (n) => [n.outlet, formatDate(n.date)].filter(Boolean).join(' · ')

  return (
    <>
      <PageHead eyebrow="News and press" title="Hon. Mathenge in the news" />
      <section className="wrap section-tight">
        {cats.length > 2 && (
          <div className="chips" role="group" aria-label="Filter news" style={{ marginBottom: 28 }}>
            {cats.map((c) => <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        )}
        <NewsSlider items={shown} key={cat} onChange={setActive} />
        {shown.length > 0 && (
          <div className="list" style={{ marginTop: 32 }}>
            {shown.map((n, k) => (
              <Reveal className={`list-row${k === active ? ' is-featured' : ''}`} key={n.id}>
                {n.image && <img src={n.image} alt="" loading="lazy" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6 }} />}
                <div style={{ flex: '1 1 340px', minWidth: 0 }}>
                  <span className="meta">{k === active && <b className="now-showing">Showing above · </b>}{meta(n)}</span>
                  <h3 style={{ fontSize: 22, marginTop: 4 }}>{n.title}</h3>
                </div>
                {n.url && <a href={n.url} target="_blank" rel="noreferrer" className="link-arrow">Open <span>→</span></a>}
              </Reveal>
            ))}
          </div>
        )}
        <p className="note">Each item links to the original article. Coverage is added from the dashboard.</p>
      </section>
    </>
  )
}
