// SEO build step. Runs after `vite build` (see package.json) and regenerates, from the site's content:
//   - one HTML file per page (dist/about.html, dist/projects/<id>.html, ...) with its own title,
//     description, canonical link, social-sharing (Open Graph / X) tags, structured data and a
//     plain-text summary for crawlers that do not run JavaScript
//   - dist/sitemap.xml and dist/robots.txt
// Content comes from Firestore (what the office publishes in the dashboard) and falls back to the
// built-in content in src/data/content.js. So every build picks up new projects and news by itself.
// Plan and checklist: docs/SEO.md
import fs from 'node:fs'
import path from 'node:path'
import { defaults } from '../src/data/content.js'
import { siteConfig } from '../site.config.js'

const DIST = path.resolve('dist')
const BASE = String(siteConfig.siteUrl || '').replace(/\/+$/, '')
const NAME = 'Hon. Duncan Maina Mathenge'
const TODAY = new Date().toISOString().slice(0, 10)

// ---------- content: Firestore if reachable, else built-in ----------
function decode(v) {
  if (!v || typeof v !== 'object') return v
  if ('stringValue' in v) return v.stringValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('booleanValue' in v) return v.booleanValue
  if ('timestampValue' in v) return v.timestampValue
  if ('nullValue' in v) return null
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(decode)
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, decode(x)]))
  return null
}

async function fromFirestore(coll) {
  const { projectId, apiKey } = siteConfig.firebase || {}
  if (!projectId || !apiKey) return null
  const out = []
  let token = ''
  for (let page = 0; page < 20; page++) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${coll}?pageSize=300&key=${apiKey}${token ? `&pageToken=${token}` : ''}`
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
    if (!res.ok) throw new Error(`${coll}: HTTP ${res.status}`)
    const json = await res.json()
    for (const d of json.documents || []) out.push({ id: d.name.split('/').pop(), ...decode({ mapValue: { fields: d.fields || {} } }) })
    if (!json.nextPageToken) break
    token = json.nextPageToken
  }
  return out
}

async function loadContent() {
  const c = { profile: defaults.profile, parliament: defaults.parliament, contact: defaults.contact, projects: defaults.projects, press: defaults.press, source: 'built-in content' }
  try {
    const [site, projects, press] = await Promise.all(['site', 'projects', 'press'].map(fromFirestore))
    if (!site) return c
    const docs = Object.fromEntries(site.map((d) => [d.id, d]))
    const merge = (base, over) => ({ ...base, ...Object.fromEntries(Object.entries(over || {}).filter(([, v]) => v !== '' && v != null && !(Array.isArray(v) && !v.length))) })
    const live = (list) => list.filter((i) => i.status !== 'draft')
    c.profile = merge(c.profile, docs.profile)
    c.contact = merge(c.contact, docs.contact)
    c.parliament = merge(c.parliament, docs.parliament)
    if (projects?.length) c.projects = live(projects)
    if (press?.length) c.press = live(press)
    c.source = 'Firestore'
  } catch (e) {
    console.warn(`[seo] Could not read Firestore (${e.message}); using built-in content.`)
  }
  return c
}

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const clip = (s, n = 158) => {
  const t = String(s || '').replace(/\s+/g, ' ').trim()
  return t.length <= n ? t : `${t.slice(0, t.lastIndexOf(' ', n - 1))}…`
}
const abs = (p) => (BASE ? `${BASE}${p}` : p)
const assets = fs.existsSync(path.join(DIST, 'assets')) ? fs.readdirSync(path.join(DIST, 'assets')) : []
const baseId = (id) => String(id).replace(/^seed-/, '')
function photoFor(id) {
  const rx = new RegExp(`^${baseId(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-[\\w-]{8}\\.(jpe?g|png|webp)$`, 'i')
  const f = assets.find((a) => rx.test(a))
  return f ? `/assets/${f}` : ''
}

// ---------- pages ----------
async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error('Run vite build first.')
  const c = await loadContent()
  const p = c.profile
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '')
  const social = [...(c.contact.social || []), ...(c.contact.links || [])].map((l) => l.url).filter((u) => /^https?:\/\//.test(u))

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': abs('/#person'),
    name: NAME,
    alternateName: [p.officialName, 'Duncan Mathenge', 'Duncan Maina Mathenge'].filter(Boolean),
    jobTitle: p.title,
    description: clip(p.intro, 300),
    url: abs('/'),
    image: abs('/og-image.jpg'),
    affiliation: p.party ? { '@type': 'PoliticalParty', name: p.party } : undefined,
    memberOf: { '@type': 'GovernmentOrganization', name: 'National Assembly of Kenya', url: 'https://www.parliament.go.ke/the-national-assembly' },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Kenya Methodist University' },
    homeLocation: { '@type': 'Place', name: 'Nyeri Town Constituency, Nyeri County, Kenya' },
    sameAs: social.length ? social : undefined,
  }
  const crumbs = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'], ...items].map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(url) })),
  })
  const cats = [...new Set(c.projects.map((x) => x.category).filter(Boolean))].map((x) => x.toLowerCase())

  const pages = [
    {
      url: '/', file: 'index.html', priority: '1.0',
      title: `${NAME} | MP for Nyeri Town`,
      description: clip(p.intro),
      h1: NAME, ld: [person, { '@context': 'https://schema.org', '@type': 'WebSite', name: NAME, url: abs('/') }],
    },
    {
      url: '/about', file: 'about.html', priority: '0.9',
      title: `About ${NAME} | MP for Nyeri Town`,
      description: clip((p.bio || []).join(' ')),
      h1: `About ${NAME}`, ld: [person, crumbs([['About', '/about']])],
    },
    {
      url: '/parliament', file: 'parliament.html', priority: '0.8',
      title: `Parliamentary record | ${NAME}`,
      description: clip(`Committees, Bills, motions and votes of ${NAME} in the National Assembly: ${(c.parliament.committees || []).map((x) => `${x.role}, ${x.name}`).join('; ')}.`),
      h1: 'Parliamentary record', ld: [crumbs([['Parliament', '/parliament']])],
    },
    {
      url: '/projects', file: 'projects.html', priority: '0.9',
      title: `Projects in Nyeri Town | ${NAME}`,
      description: clip(`${c.projects.length} projects in Nyeri Town Constituency, covering ${cats.join(', ')}: classrooms, laboratories, roads, high-mast lighting and more.`),
      h1: 'Projects in Nyeri Town', ld: [crumbs([['Projects', '/projects']])],
      list: c.projects.map((x) => [x.title, `/projects/${x.id}`]),
    },
    ...c.projects.map((x) => ({
      url: `/projects/${x.id}`, file: `projects/${x.id}.html`, priority: '0.7', type: 'article',
      title: `${clip(x.title, 70)} | Nyeri Town projects`,
      description: clip(x.description || `${x.title}, Nyeri Town Constituency.`),
      image: photoFor(x.id),
      h1: x.title, ld: [crumbs([['Projects', '/projects'], [x.title, `/projects/${x.id}`]])],
    })),
    {
      url: '/news', file: 'news.html', priority: '0.8',
      title: `News and press | ${NAME}`,
      description: clip(`Latest news on ${NAME}, MP for Nyeri Town: ${c.press.slice(0, 3).map((n) => n.title).join('; ')}.`),
      h1: 'News and press', ld: [crumbs([['News', '/news']])],
      list: c.press.filter((n) => n.url).map((n) => [n.title, n.url]),
    },
    {
      url: '/gallery', file: 'gallery.html', priority: '0.6',
      title: `Gallery | ${NAME}`,
      description: `Photos and video of projects, Parliament and events in Nyeri Town with ${NAME}.`,
      h1: 'Gallery', ld: [crumbs([['Gallery', '/gallery']])],
    },
    {
      url: '/contact', file: 'contact.html', priority: '0.6',
      title: `Contact the office of ${NAME}`,
      description: `Write to the office of ${NAME}, Member of Parliament for Nyeri Town, about an issue in the constituency, an invitation or a Bill.`,
      h1: 'Contact', ld: [crumbs([['Contact', '/contact']])],
    },
  ]

  for (const pg of pages) {
    const img = abs(pg.image || '/og-image.jpg')
    const head = [
      `<title>${esc(pg.title)}</title>`,
      `<meta name="description" content="${esc(pg.description)}" />`,
      `<meta name="robots" content="index, follow, max-image-preview:large" />`,
      BASE && `<link rel="canonical" href="${esc(abs(pg.url))}" />`,
      `<meta property="og:site_name" content="${esc(NAME)}" />`,
      `<meta property="og:type" content="${pg.type || 'website'}" />`,
      `<meta property="og:locale" content="en_KE" />`,
      `<meta property="og:title" content="${esc(pg.title)}" />`,
      `<meta property="og:description" content="${esc(pg.description)}" />`,
      BASE && `<meta property="og:url" content="${esc(abs(pg.url))}" />`,
      `<meta property="og:image" content="${esc(img)}" />`,
      `<meta property="og:image:alt" content="${esc(pg.h1)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(pg.title)}" />`,
      `<meta name="twitter:description" content="${esc(pg.description)}" />`,
      `<meta name="twitter:image" content="${esc(img)}" />`,
      ...pg.ld.map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`),
    ].filter(Boolean).join('\n    ')
    const nav = [['Home', '/'], ['About', '/about'], ['Parliament', '/parliament'], ['Projects', '/projects'], ['News', '/news'], ['Gallery', '/gallery'], ['Contact', '/contact']]
    const summary = `<noscript><main><h1>${esc(pg.h1)}</h1><p>${esc(pg.description)}</p>${
      pg.list ? `<ul>${pg.list.map(([t, u]) => `<li><a href="${esc(u)}">${esc(t)}</a></li>`).join('')}</ul>` : ''
    }<nav>${nav.map(([t, u]) => `<a href="${u}">${t}</a>`).join(' · ')}</nav></main></noscript>`
    const html = template.replace('</head>', `    ${head}\n  </head>`).replace('<div id="root"></div>', `<div id="root"></div>\n    ${summary}`)
    const out = path.join(DIST, pg.file)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, html)
  }

  // sitemap and robots
  const robots = ['User-agent: *', 'Allow: /', 'Disallow: /admin', BASE && `Sitemap: ${BASE}/sitemap.xml`].filter(Boolean).join('\n') + '\n'
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots)
  if (BASE) {
    const urls = pages.map((pg) => `  <url><loc>${esc(abs(pg.url))}</loc><lastmod>${TODAY}</lastmod><priority>${pg.priority}</priority></url>`).join('\n')
    fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
  }
  console.log(`[seo] ${pages.length} pages from ${c.source}${BASE ? `, sitemap for ${BASE}` : '. No siteUrl in site.config.js yet: canonical links and sitemap.xml skipped.'}`)
}

main().catch((e) => {
  console.error('[seo] failed:', e.message)
  process.exit(1)
})
