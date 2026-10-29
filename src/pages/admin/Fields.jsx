import { useState } from 'react'
import { getStorageKit, storageReady } from '../../lib/firebase.js'
import { MAX_VIDEO_MB, resizeImage, videoPoster } from '../../lib/media.js'

const blank = (fields) => Object.fromEntries(fields.map((f) => [f.key, f.type === 'number' ? 0 : '']))

export function ImageInput({ value, onChange, multiple = false, max = 6, side = 1100 }) {
  const [err, setErr] = useState('')
  const list = multiple ? value || [] : value ? [value] : []

  async function pick(e) {
    setErr('')
    const files = [...e.target.files].slice(0, multiple ? max - list.length : 1)
    e.target.value = ''
    try {
      const urls = []
      for (const f of files) urls.push(await resizeImage(f, side))
      onChange(multiple ? [...list, ...urls] : urls[0] || '')
    } catch (ex) {
      setErr(ex.message)
    }
  }

  const remove = (i) => (multiple ? onChange(list.filter((_, j) => j !== i)) : onChange(''))

  return (
    <div className="adm-images">
      <div className="adm-thumbs">
        {list.map((src, i) => (
          <figure key={i}>
            <img src={src} alt="" />
            <button type="button" onClick={() => remove(i)} aria-label="Remove photo">×</button>
          </figure>
        ))}
        {(multiple ? list.length < max : !value) && (
          <label className="adm-drop">
            <span>{multiple ? 'Add photos' : 'Choose photo'}</span>
            <input type="file" accept="image/*" multiple={multiple} onChange={pick} hidden />
          </label>
        )}
      </div>
      {multiple && <small>Up to {max} photos. They are resized automatically and also appear in the Gallery.</small>}
      {err && <p className="adm-alert">{err}</p>}
    </div>
  )
}

/** Uploads one video file to Firebase Storage. Value: { url, path, thumb, name, size } */
export function VideoInput({ value, onChange }) {
  const [err, setErr] = useState('')
  const [pct, setPct] = useState(-1)

  async function pick(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setErr('')
    if (!file.type.startsWith('video/')) return setErr('Please choose a video file (MP4 works best).')
    if (file.size > MAX_VIDEO_MB * 1024 * 1024)
      return setErr(`That video is ${Math.round(file.size / 1048576)} MB. The limit is ${MAX_VIDEO_MB} MB; shorten it or export it at 720p first.`)
    try {
      const kit = await getStorageKit()
      if (!kit) throw new Error('Video upload is not set up yet: Firebase Storage is not configured. See the README.')
      const { st, storage } = kit
      setPct(0)
      const thumb = await videoPoster(file)
      const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '')
      const path = `videos/${Date.now()}-${safe}`
      const task = st.uploadBytesResumable(st.ref(storage, path), file, { contentType: file.type, cacheControl: 'public, max-age=31536000' })
      await new Promise((resolve, reject) => {
        task.on('state_changed', (snap) => setPct(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)), reject, resolve)
      })
      const url = await st.getDownloadURL(task.snapshot.ref)
      onChange({ url, path, thumb, name: file.name, size: file.size })
    } catch (ex) {
      const code = ex.code || ''
      setErr(
        /unauthorized/.test(code)
          ? 'Firebase refused the upload. Check that storage.rules is published and this account is an admin.'
          : /bucket-not-found|no-default-bucket|project-not-found/.test(code)
            ? 'Firebase Storage is not switched on for this project yet. See the README, “Uploading videos”.'
            : ex.message,
      )
    }
    setPct(-1)
  }

  if (!storageReady) return <p className="adm-alert">Video upload needs Firebase Storage. Add the storageBucket value in site.config.js.</p>

  return (
    <div className="adm-images">
      {value?.url ? (
        <div className="adm-video">
          <video src={value.url} poster={value.thumb || undefined} controls preload="metadata" />
          <div>
            <b>{value.name || 'Uploaded video'}</b>
            {value.size ? <small>{Math.round(value.size / 1048576)} MB</small> : null}
            <button type="button" className="adm-link danger" onClick={() => onChange(null)}>Remove and choose another</button>
          </div>
        </div>
      ) : pct >= 0 ? (
        <div className="adm-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <i style={{ width: `${pct}%` }} />
          <span>Uploading… {pct}%. Keep this page open.</span>
        </div>
      ) : (
        <label className="adm-drop adm-drop-wide">
          <span>Choose video file</span>
          <input type="file" accept="video/*" onChange={pick} hidden />
        </label>
      )}
      <small>MP4 up to {MAX_VIDEO_MB} MB. A thumbnail is taken from the video automatically. Save the item after the upload finishes.</small>
      {err && <p className="adm-alert">{err}</p>}
    </div>
  )
}

export function Field({ def, value, onChange }) {
  const { type = 'text', label, options, hint } = def
  const wrap = (control) => (
    <div className={`adm-field ${def.wide ? 'wide' : ''}`}>
      <span className="adm-label">{label}</span>
      {control}
      {hint && <small>{hint}</small>}
    </div>
  )

  if (type === 'textarea') return wrap(<textarea rows={def.rows || 4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />)
  if (type === 'select')
    return wrap(
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>,
    )
  if (type === 'number') return wrap(<input type="number" min="0" value={value ?? 0} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />)
  if (type === 'image') return wrap(<ImageInput value={value} onChange={onChange} side={def.side || 1000} />)
  if (type === 'images') return wrap(<ImageInput value={value} onChange={onChange} multiple max={def.max || 6} />)
  if (type === 'video') return wrap(<VideoInput value={value} onChange={onChange} />)
  if (type === 'strings') return wrap(<StringList value={value} onChange={onChange} long={def.long} />)
  if (type === 'list') return wrap(<ObjectList def={def} value={value} onChange={onChange} />)
  if (type === 'group')
    return wrap(
      <div className="adm-grid">
        {def.fields.map((f) => (
          <Field key={f.key} def={f} value={value?.[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
        ))}
      </div>,
    )
  return wrap(<input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} required={def.required} />)
}

function StringList({ value, onChange, long }) {
  const list = value || []
  const set = (i, v) => onChange(list.map((x, j) => (j === i ? v : x)))
  return (
    <div className="adm-rows">
      {list.map((s, i) => (
        <div className="adm-row" key={i}>
          {long ? <textarea rows={4} value={s} onChange={(e) => set(i, e.target.value)} /> : <input value={s} onChange={(e) => set(i, e.target.value)} />}
          <button type="button" className="adm-x" onClick={() => onChange(list.filter((_, j) => j !== i))} aria-label="Remove">×</button>
        </div>
      ))}
      <button type="button" className="adm-add" onClick={() => onChange([...list, ''])}>+ Add</button>
    </div>
  )
}

function ObjectList({ def, value, onChange }) {
  const list = value || []
  const set = (i, key, v) => onChange(list.map((x, j) => (j === i ? { ...x, [key]: v } : x)))
  const move = (i, d) => {
    const next = [...list]
    const j = i + d
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="adm-rows">
      {list.map((item, i) => (
        <div className="adm-card" key={i}>
          <div className="adm-grid">
            {def.fields.map((f) => <Field key={f.key} def={f} value={item[f.key]} onChange={(v) => set(i, f.key, v)} />)}
          </div>
          <div className="adm-card-tools">
            <button type="button" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
            <button type="button" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
            <button type="button" onClick={() => onChange(list.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </div>
      ))}
      <button type="button" className="adm-add" onClick={() => onChange([...list, blank(def.fields)])}>+ Add {def.noun || 'row'}</button>
    </div>
  )
}
