import { useRef, useState } from 'react'
import { getDb } from '../../lib/firebase.js'
import { resizeImage } from '../../lib/media.js'

const MAX = 60
const caption = (name) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/^(img|dsc|pxl|photo|image|whatsapp image)[-_ ]?[\d-_ .at]*$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase())

/** Adds many photos to the Gallery at once: one gallery item per photo, all in the chosen category. */
export default function BulkPhotos({ categories, onDone, onClose }) {
  const [files, setFiles] = useState([])
  const [category, setCategory] = useState(categories[0])
  const [useNames, setUseNames] = useState(true)
  const [progress, setProgress] = useState(null) // { done, total }
  const [err, setErr] = useState('')
  const [drag, setDrag] = useState(false)
  const input = useRef(null)

  function add(list) {
    setErr('')
    const imgs = [...list].filter((f) => f.type.startsWith('image/'))
    if (imgs.length < list.length) setErr('Some files were skipped because they are not photos.')
    setFiles((cur) => {
      const next = [...cur, ...imgs.map((f) => ({ file: f, url: URL.createObjectURL(f) }))]
      if (next.length > MAX) setErr(`Up to ${MAX} photos at a time. Upload the rest in another round.`)
      return next.slice(0, MAX)
    })
  }

  function remove(i) {
    setFiles((cur) => {
      URL.revokeObjectURL(cur[i].url)
      return cur.filter((_, j) => j !== i)
    })
  }

  async function upload() {
    setErr('')
    setProgress({ done: 0, total: files.length })
    let done = 0
    const failed = []
    try {
      const { fs, db } = await getDb()
      // Small batches keep each write well under Firestore's request size limit.
      for (let i = 0; i < files.length; i += 8) {
        const batch = fs.writeBatch(db)
        for (const { file } of files.slice(i, i + 8)) {
          try {
            const src = await resizeImage(file, 1400, 0.74)
            batch.set(fs.doc(fs.collection(db, 'gallery')), {
              type: 'photo',
              title: useNames ? caption(file.name) : '',
              category,
              src,
              url: '',
              status: 'published',
              createdAt: fs.serverTimestamp(),
            })
            done++
          } catch {
            failed.push(file.name)
          }
        }
        await batch.commit()
        setProgress({ done, total: files.length })
      }
      files.forEach((f) => URL.revokeObjectURL(f.url))
      setFiles([])
      await onDone(`Added ${done} photo${done === 1 ? '' : 's'} to the Gallery${failed.length ? `. Could not read: ${failed.join(', ')}` : ''}.`)
    } catch (ex) {
      setErr(`Stopped after ${done} photo${done === 1 ? '' : 's'}: ${ex.message}`)
    }
    setProgress(null)
  }

  const busy = Boolean(progress)

  return (
    <div className="adm-panel">
      <h2>Add photos in bulk</h2>
      <div
        className={`adm-bulk-drop${drag ? ' on' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          if (!busy) add(e.dataTransfer.files)
        }}
        onClick={() => !busy && input.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
      >
        <b>Drop photos here or click to choose</b>
        <small>Up to {MAX} at a time. Each is resized automatically and becomes its own Gallery item.</small>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => (add(e.target.files), (e.target.value = ''))} />
      </div>

      {files.length > 0 && (
        <>
          <div className="adm-thumbs">
            {files.map((f, i) => (
              <figure key={f.url}>
                <img src={f.url} alt="" />
                {!busy && <button type="button" onClick={() => remove(i)} aria-label="Remove photo">×</button>}
              </figure>
            ))}
          </div>
          <div className="adm-grid">
            <div className="adm-field">
              <span className="adm-label">Category for these photos</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={busy}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <input type="checkbox" checked={useNames} onChange={(e) => setUseNames(e.target.checked)} disabled={busy} />
            Use file names as captions (camera names like IMG_2034 are left blank)
          </label>
        </>
      )}

      {busy && (
        <div className="adm-progress" role="progressbar" aria-valuenow={progress.done} aria-valuemin={0} aria-valuemax={progress.total}>
          <i style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          <span>Uploading {progress.done} of {progress.total}… keep this page open.</span>
        </div>
      )}
      {err && <p className="adm-alert">{err}</p>}

      <div className="adm-actions">
        <button type="button" className="adm-btn" onClick={upload} disabled={busy || !files.length}>
          {busy ? 'Uploading…' : `Add ${files.length || ''} photo${files.length === 1 ? '' : 's'} to the Gallery`}
        </button>
        <button type="button" className="adm-btn ghost" onClick={onClose} disabled={busy}>Close</button>
      </div>
      <small>Captions can be edited afterwards with Edit on each photo.</small>
    </div>
  )
}
