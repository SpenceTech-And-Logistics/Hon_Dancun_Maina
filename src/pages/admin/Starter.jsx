import { useEffect, useState } from 'react'
import { check, needsAction, norm } from './seedSync.js'
import { getDb } from '../../lib/firebase.js'
import { useContent } from '../../lib/useContent.js'

/** Finds items in projects and news that share a title. Keeps one of each (the seed- copy, so photos
 * in src/assets match it), moves any photos from the extra copies onto it, and deletes the extras. */
async function dedupe(apply) {
  const { fs, db } = await getDb()
  let removed = 0
  const batch = fs.writeBatch(db)
  for (const c of ['projects', 'press']) {
    const snap = await fs.getDocs(fs.collection(db, c))
    const groups = {}
    for (const d of snap.docs) (groups[norm(d.data().title)] ||= []).push(d)
    for (const docs of Object.values(groups)) {
      if (docs.length < 2) continue
      docs.sort((a, b) => Number(b.id.startsWith('seed-')) - Number(a.id.startsWith('seed-')) || (a.data().createdAt?.seconds || 0) - (b.data().createdAt?.seconds || 0))
      const [keep, ...extra] = docs
      const k = keep.data()
      if (c === 'projects') {
        const photos = [...new Set([...(k.photos || []), ...extra.flatMap((d) => d.data().photos || [])])]
        if (photos.length !== (k.photos || []).length && apply) batch.update(keep.ref, { photos: photos.slice(0, 5) })
      } else if (!k.image) {
        const img = extra.map((d) => d.data().image).find(Boolean)
        if (img && apply) batch.update(keep.ref, { image: img })
      }
      for (const d of extra) {
        if (apply) batch.delete(d.ref)
        removed++
      }
    }
  }
  if (apply && removed) await batch.commit()
  return removed
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
        if (r.remove) {
          if (r.exists) {
            batch.delete(fs.doc(db, ...r.path))
            n++
          }
          continue
        }
        if ((r.exists || r.sameTitle) && !replace) continue
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

  const missing = rows ? rows.filter(needsAction).length : 0
  const [dupes, setDupes] = useState(null)
  useEffect(() => {
    let alive = true
    dedupe(false).then((n) => alive && setDupes(n)).catch(() => {})
    return () => {
      alive = false
    }
  }, [rows])

  async function clean() {
    setBusy(true)
    setMsg(null)
    try {
      const n = await dedupe(true)
      setRows(await check())
      refresh()
      setMsg({ text: `Removed ${n} duplicate${n === 1 ? '' : 's'}. One copy of each project and story is kept, with any photos from the copies moved onto it.` })
    } catch (ex) {
      setMsg({ bad: true, text: ex.message })
    }
    setBusy(false)
  }

  return (
    <>
      <div className="adm-top">
        <div>
          <h1>Fill the database</h1>
          <p>Copies the verified profile, Parliament record, contact details and news into Firebase, so every section of this dashboard opens filled in and ready to edit.</p>
        </div>
      </div>
      {msg && <p className={msg.bad ? 'adm-alert' : 'adm-ok'} role="status">{msg.text}</p>}
      {dupes > 0 && (
        <div className="adm-panel" style={{ borderColor: '#a8322a' }}>
          <h2>{dupes} duplicate{dupes === 1 ? '' : 's'} found</h2>
          <p>Some projects or news stories are in the database more than once, usually because the CSV was imported as well as filled from here. This keeps one copy of each, moves any photos from the extra copies onto it, and deletes the extras.</p>
          <div><button type="button" className="adm-btn" onClick={clean} disabled={busy}>{busy ? 'Working…' : `Remove ${dupes} duplicate${dupes === 1 ? '' : 's'}`}</button></div>
        </div>
      )}
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
                    <td>{r.remove ? (r.exists ? 'Yes, will be removed' : 'Already removed') : r.exists ? (replace ? 'Yes, will be replaced' : 'Yes, kept as is') : r.sameTitle ? 'Yes (imported), kept as is' : 'Not yet'}</td>
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
            {busy ? 'Writing…' : replace ? 'Write everything' : missing ? `Update ${missing} item${missing === 1 ? '' : 's'}` : 'All up to date'}
          </button>
        </div>
        <small>Items already in the database under the same title (for example from a CSV import) are not added again.</small>
      </div>
    </>
  )
}
