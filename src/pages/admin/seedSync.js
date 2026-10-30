import { RETIRED, defaults } from '../../data/content.js'
import { getDb } from '../../lib/firebase.js'

/**
 * Copies the site's built-in content (verified from Parliament, Mzalendo and the press)
 * into Firestore so the office can edit it from the dashboard.
 * Anything already in the database is left alone unless "Replace" is ticked.
 */
const strip = ({ id, ...rest }) => {
  void id
  return rest
}

export function plan() {
  return [
    { label: 'Profile and career', path: ['site', 'profile'], data: defaults.profile },
    { label: 'Parliament record', path: ['site', 'parliament'], data: defaults.parliament },
    { label: 'Contact and social links', path: ['site', 'contact'], data: defaults.contact },
    ...defaults.press.map((p) => ({ label: `News: ${p.title}`, path: ['press', `seed-${p.id}`], data: { status: 'published', ...strip(p) }, stamp: true })),
    ...defaults.projects.map((p, i) => ({ label: `Project: ${p.title}`, path: ['projects', `seed-${p.id || i}`], data: { status: 'published', ...strip(p) }, stamp: true })),
    ...defaults.gallery.map((g, i) => ({ label: `Gallery: ${g.title}`, path: ['gallery', `seed-${g.id || i}`], data: { status: 'published', ...strip(g) }, stamp: true })),
    ...Object.entries(RETIRED).flatMap(([coll, ids]) => ids.map((id) => ({ label: `Remove replaced item: ${id}`, path: [coll, `seed-${id}`], remove: true, data: {} }))),
  ]
}

export const norm = (t) => String(t || '').trim().toLowerCase().replace(/\s+/g, ' ')

export async function check() {
  const { fs, db } = await getDb()
  const list = plan()
  const titles = {}
  for (const c of ['projects', 'press']) {
    const snap = await fs.getDocs(fs.collection(db, c))
    titles[c] = new Set(snap.docs.map((d) => norm(d.data().title)))
  }
  const exists = await Promise.all(list.map((r) => fs.getDoc(fs.doc(db, ...r.path)).then((s) => s.exists())))
  return list.map((r, i) => ({ ...r, exists: exists[i], sameTitle: !r.remove && !exists[i] && Boolean(titles[r.path[0]]?.has(norm(r.data.title))) }))
}

export const needsAction = (r) => (r.remove ? r.exists : !r.exists && !r.sameTitle)

/** How many built-in items (new projects, news, removals) the database is missing. Used by the dashboard banner. */
export async function pendingCount() {
  return (await check()).filter(needsAction).length
}

