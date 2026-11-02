import { Link, useSearchParams } from 'react-router-dom'
import Empty from '../components/Empty.jsx'
import PageHead from '../components/PageHead.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { FUNDS } from '../data/content.js'
import { useContent } from '../lib/useContent.js'

const ALL = 'All'
const TABS = [ALL, ...FUNDS]
const FUND_LABEL = { [ALL]: 'All Projects', 'NG-CDF': 'NG-CDF Projects', 'National Government': 'National Government Projects' }
const FUND_NOTE = {
  [ALL]: 'Every project in Nyeri Town, both NG-CDF and National Government.',
  'NG-CDF': 'Built with the National Government Constituencies Development Fund for Nyeri Town, which the MP oversees.',
  'National Government': 'National Government projects in Nyeri Town that the MP has championed and followed up.',
}

export default function Projects() {
  const { projects, projectCategories } = useContent()
  const [params, setParams] = useSearchParams()
  const counts = { [ALL]: projects.length, ...Object.fromEntries(FUNDS.map((f) => [f, projects.filter((p) => p.fund === f).length])) }
  const fund = TABS.includes(params.get('fund')) ? params.get('fund') : ALL
  const inFund = fund === ALL ? projects : projects.filter((p) => p.fund === fund)

  // Sub-category filters follow the order set in the dashboard; unlisted ones come next and "Other" is last.
  const rank = (c) => (c === 'Other' ? 999 : projectCategories.includes(c) ? projectCategories.indexOf(c) : 500)
  const cats = ['All', ...[...new Set(inFund.map((p) => p.category).filter(Boolean))].sort((a, b) => rank(a) - rank(b))]
  const cat = cats.includes(params.get('cat')) ? params.get('cat') : 'All'
  const shown = cat === 'All' ? inFund : inFund.filter((p) => p.category === cat)
  const go = (f, c) => setParams({ ...(f !== ALL ? { fund: f } : {}), ...(c && c !== 'All' ? { cat: c } : {}) }, { replace: true })

  return (
    <>
      <PageHead
        eyebrow="Projects"
        title="Work delivered in Nyeri Town"
        lead="NG-CDF and National Government projects in health, education, roads, water, sanitation, youth and sports and national administration: what has been done, where and for whom."
      />
      <section className="wrap section-tight">
        {projects.length === 0 ? (
          <Empty
            title="Project updates are on the way"
            text="The office is preparing the list of projects delivered in Nyeri Town. They will appear here, with photos, as soon as they are published."
            cta={{ to: '/contact', label: 'Tell the office about a project' }}
          />
        ) : (
          <>
            <div className="fund-tabs" role="tablist" aria-label="Project type">
              {TABS.map((f) => (
                <button key={f} type="button" role="tab" aria-selected={fund === f} className="fund-tab" onClick={() => go(f)}>
                  {FUND_LABEL[f]} <span>{counts[f]}</span>
                </button>
              ))}
            </div>
            <p className="note" style={{ margin: '14px 0 22px' }}>{FUND_NOTE[fund]}</p>
            {cats.length > 2 && (
              <div className="chips" role="group" aria-label="Filter by category" style={{ marginBottom: 28 }}>
                {cats.map((c) => (
                  <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => go(fund, c)}>{c}</button>
                ))}
              </div>
            )}
            {shown.length === 0 ? (
              <p className="muted">No {FUND_LABEL[fund].replace('All Projects', 'projects')} published yet.</p>
            ) : (
              <div className="grid grid-3">
                {shown.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 100}>
                    <Link to={`/projects/${p.id}`} className="card card-link">
                      <div className="card-img">{p.photos?.[0] ? <img src={p.photos[0]} alt={p.title} loading="lazy" /> : <div className="img-fallback">{p.category?.[0]}</div>}</div>
                      <div className="card-body">
                        <span className="tag">{fund === ALL && p.fund ? `${p.fund === 'National Government' ? 'National Govt' : p.fund} · ${p.category}` : p.category}</span>
                        <h3>{p.title}</h3>
                        {p.description && <p>{p.description.length > 120 ? `${p.description.slice(0, 117)}…` : p.description}</p>}
                        <span className="meta">{[p.ward, p.year].filter(Boolean).join(' · ')}</span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}
