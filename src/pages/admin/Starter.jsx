import { useEffect, useState } from 'react'
import { defaults } from '../../data/content.js'
import { getDb } from '../../lib/firebase.js'
import { useContent } from '../../lib/useContent.js'

/**
 * Copies the site's built-in content (verified from Parliament, Mzalendo and the press)
 * into Firestore so the office can edit it from the dashboard.
 * Anything already in the database is left alone unless "Replace" is ticked.
 */
const strip = ({ id, ...rest }) => {
  void id
  return rest
}

function plan() {
  return [
    { label: 'Profile and career', path: ['site', 'profile'], data: defaults.profile },
    { label: 'Parliament record', path: ['site', 'parliament'], data: defaults.parliament },
    { label: 'Contact and social links', path: ['site', 'contact'], data: defaults.contact },
    ...defaults.press.map((p) => ({ label: `News: ${p.title}`, path: ['press', `seed-${p.id}`], data: { status: 'published', ...strip(p) }, stamp: true })),
    ...defaults.projects.map((p, i) => ({ label: `Project: ${p.title}`, path: ['projects', `seed-${p.id || i}`], data: { status: 'published', ...strip(p) }, stamp: true })),
    ...defaults.gallery.map((g, i) => ({ label: `Gallery: ${g.title}`, path: ['gallery', `seed-${g.id || i}`], data: { status: 'published', ...strip(g) }, stamp: true })),
  ]
}

async function check() {
  const { fs, db } = await getDb()
  const list = plan()
  const exists = await Promise.all(list.map((r) => fs.getDoc(fs.doc(db, ...r.path)).then((s) => s.exists())))
  return list.map((r, i) => ({ ...r, exists: exists[i] }))
}

export default function Starter() {
  const { refresh } = useContent()
  const [rows, setRows] = useState(null)
  const [replace, setReplace] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    let alive = true
    check()
      .then((list) => alive && setRows(list))
      .catch((e) => alive && setMsg({ bad: true, text: `Could not read the database: ${e.message}` }))
    return () => {
      alive = false
    }
  }, [])

  async function fill() {
    setBusy(true)
    setMsg(null)
    try {
      const { fs, db } = await getDb()
      const batch = fs.writeBatch(db)
      let n = 0
      for (const r of rows) {
        if (r.exists && !replace) continue
        batch.set(fs.doc(db, ...r.path), r.stamp ? { ...r.data, createdAt: fs.serverTimestamp() } : r.data)
        n++
      }
      if (n) await batch.commit()
      setRows(await check())
      refresh()
      setMsg({ text: n ? `Done. ${n} item${n === 1 ? '' : 's'} written. The public site now reads from the database.` : 'Nothing to write. Everything is already in the database.' })
    } catch (ex) {
      setMsg({ bad: true, text: /permission/i.test(ex.message) ? 'Firebase refused the write. Check that firestore.rules is published and this account has admins/{UID} with ok = true.' : ex.message })
    }
    setBusy(false)
  }

  const missing = rows ? rows.filter((r) => !r.exists).length : 0

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Fill the database</h1>
          <p>Copies the verified profile, Parliament record, contact details and news into Firebase, so every section of this dashboard opens filled in and ready to edit.</p>
        </div>
      </div>
      {msg && <p className={msg.bad ? 'adm-alert' : 'adm-ok'} role="status">{msg.text}</p>}
      <div className="adm-panel flush">
        {!rows ? (
          <p className="adm-pad">Checking the database…</p>
        ) : (
          <div className="adm-scroll">
            <table className="adm-table">
              <thead><tr><th>Item</th><th>Where</th><th>In the database</th></tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.path.join('/')}>
                    <td>{r.label}</td>
                    <td><code>{r.path.join('/')}</code></td>
                    <td>{r.exists ? (replace ? 'Yes, will be replaced' : 'Yes, kept as is') : 'Not yet'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="adm-panel">
        <label style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} />
          Replace items that are already in the database (undoes any edits the office has made to them)
        </label>
        <div>
          <button type="button" className="adm-btn" onClick={fill} disabled={busy || !rows || (!missing && !replace)}>
            {busy ? 'Writing…' : replace ? 'Write everything' : missing ? `Add ${missing} missing item${missing === 1 ? '' : 's'}` : 'All filled'}
          </button>
        </div>
        <small>Projects and gallery stay empty until the office adds real Nyeri Town projects and photos; the site hides those sections cleanly until then.</small>
      </div>
    </>
  )
}
