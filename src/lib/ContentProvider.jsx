import { useCallback, useEffect, useMemo, useState } from 'react'
import { defaults } from '../data/content.js'
import { getDb } from './firebase.js'
import { ContentContext } from './useContent.js'

const nonEmpty = (v) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== '')

function merge(base, over) {
  if (!over) return base
  const out = { ...base }
  for (const k of Object.keys(over)) if (nonEmpty(over[k])) out[k] = over[k]
  return out
}

// Photos dropped into src/assets/projects and src/assets/news are matched to items by file name:
//   projects: <project-id>.jpg, <project-id>-2.jpg, <project-id>-3.jpg …   news: <story-id>.jpg
// See the README.md in each folder for the list of IDs.
const opts = { eager: true, query: '?url', import: 'default' }
const toMap = (files) => {
  const map = {}
  for (const [path, url] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))) {
    const key = path.split('/').pop().replace(/\.[^.]+$/, '').replace(/-\d+$/, '').toLowerCase()
    ;(map[key] ||= []).push(url)
  }
  return map
}
const projectFiles = toMap(import.meta.glob('../assets/projects/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', opts))
const newsFiles = toMap(import.meta.glob('../assets/news/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', opts))
const baseId = (id = '') => String(id).replace(/^seed-/, '').toLowerCase()
const withProjectPhotos = (p) => {
  const extra = projectFiles[baseId(p.id)]
  return extra ? { ...p, photos: [...new Set([...(p.photos || []), ...extra])] } : p
}
const withNewsImage = (n) => (n.image ? n : { ...n, image: newsFiles[baseId(n.id)]?.[0] || '' })

const byDateDesc = (a, b) => String(b.date || b.year || '').localeCompare(String(a.date || a.year || ''))

export function ContentProvider({ children }) {
  const [remote, setRemote] = useState(null)
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const kit = await getDb()
      if (!kit) return
      const { fs, db } = kit
      try {
        const [site, projects, press, gallery] = await Promise.all(
          ['site', 'projects', 'press', 'gallery'].map((c) => fs.getDocs(fs.collection(db, c))),
        )
        const list = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        const docs = Object.fromEntries(site.docs.map((d) => [d.id, d.data()]))
        if (alive) setRemote({ docs, projects: list(projects), press: list(press), gallery: list(gallery) })
      } catch (err) {
        console.warn('Could not load content from Firebase; showing built-in content.', err)
      }
    })()
    return () => {
      alive = false
    }
  }, [tick])

  const value = useMemo(() => {
    const r = remote
    const published = (items) => items.filter((i) => i.status !== 'draft')
    const projects = (r && r.projects.length ? published(r.projects) : [...defaults.projects]).sort(byDateDesc).map(withProjectPhotos)
    const press = (r && r.press.length ? published(r.press) : [...defaults.press]).sort(byDateDesc).map(withNewsImage)
    const gallery = r && r.gallery.length ? published(r.gallery) : defaults.gallery
    return {
      profile: merge(defaults.profile, r?.docs.profile),
      parliament: merge(defaults.parliament, r?.docs.parliament),
      contact: merge(defaults.contact, r?.docs.contact),
      projects,
      press,
      gallery,
      live: Boolean(r),
      refresh,
    }
  }, [remote, refresh])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
