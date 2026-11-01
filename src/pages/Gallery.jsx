import { useCallback, useMemo, useState } from 'react'
import Empty from '../components/Empty.jsx'
import Lightbox from '../components/Lightbox.jsx'
import PageHead from '../components/PageHead.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { videoInfo } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'

export default function Gallery() {
  const { gallery } = useContent()
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(-1)

  // Only items added in the dashboard's Gallery section. Project and news photos stay on their own pages.
  const all = useMemo(() => {
    const own = gallery.map((g) => {
      if (g.type === 'video') {
        const v = videoInfo(g.url)
        return { id: g.id, kind: 'video', title: g.title, category: 'Videos', thumb: g.thumb || v.thumb, embed: v.embed, url: g.url }
      }
      return { id: g.id, kind: 'photo', title: g.title, category: g.category, src: g.src, thumb: g.src }
    })
    return own.filter((i) => i.thumb || i.kind === 'video')
  }, [gallery])

  const cats = ['All', ...new Set(all.map((i) => i.category).filter(Boolean))]
  const shown = cat === 'All' ? all : all.filter((i) => i.category === cat)
  const viewable = shown.filter((i) => i.kind === 'photo' || i.embed)
  const move = useCallback((d) => setOpen((i) => (i < 0 ? i : (i + d + viewable.length) % viewable.length)), [viewable.length])
  const close = useCallback(() => setOpen(-1), [])

  return (
    <>
      <PageHead eyebrow="Gallery" title="Photos and video from the work" />
      <section className="wrap section-tight">
        {all.length === 0 ? (
          <Empty title="Photos and video are coming" text="The office is gathering pictures from Parliament, the constituency and events. They will appear here when published." />
        ) : (
          <>
            <div className="chips" role="group" aria-label="Filter gallery" style={{ marginBottom: 28 }}>
              {cats.map((c) => <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => { setCat(c); setOpen(-1) }}>{c}</button>)}
            </div>
            <div className="mosaic">
              {shown.map((item, i) => {
                const idx = viewable.indexOf(item)
                const inner = (
                  <>
                    {item.thumb ? <img src={item.thumb} alt={item.title || ''} loading="lazy" /> : <span className="vid-fallback" />}
                    {item.kind === 'video' && <><span className="play" aria-hidden="true">▶</span><span className="badge">Video</span></>}
                  </>
                )
                return (
                  <Reveal key={item.id} delay={(i % 3) * 80}>
                    {idx >= 0 ? (
                      <button type="button" className="tileimg" onClick={() => setOpen(idx)} aria-label={item.title || 'Open'}>{inner}</button>
                    ) : (
                      <a className="tileimg" href={item.url} target="_blank" rel="noreferrer" aria-label={`${item.title || 'Video'} (opens in a new tab)`}>{inner}</a>
                    )}
                  </Reveal>
                )
              })}
            </div>
            <p className="note">Photos open in a larger viewer.</p>
          </>
        )}
      </section>
      {open >= 0 && viewable[open] && <Lightbox items={viewable} index={open} onClose={close} onMove={move} />}
    </>
  )
}
