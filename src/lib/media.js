/** Resize an image file to a compact JPEG data URL (stored in Firestore, so no paid Storage is needed). */
export function resizeImage(file, maxSide = 1200, quality = 0.74) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file.'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That image could not be read.'))
    }
    img.src = url
  })
}

/** Work out how to show a video link: thumbnail and an embeddable address when one exists. */
export function videoInfo(link = '') {
  const url = link.trim()
  let m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  if (m) return { kind: 'youtube', thumb: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`, embed: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` }
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (m) return { kind: 'drive', thumb: '', embed: `https://drive.google.com/file/d/${m[1]}/preview` }
  if (/facebook\.com|fb\.watch/.test(url)) return { kind: 'facebook', thumb: '', embed: '' }
  if (/tiktok\.com/.test(url)) return { kind: 'tiktok', thumb: '', embed: '' }
  return { kind: 'link', thumb: '', embed: '' }
}

export const formatDate = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const money = (n) => (n ? `KES ${Number(n).toLocaleString('en-KE')}` : '')

export const MAX_VIDEO_MB = 200

/** Grab a frame about a second in and return it as a small JPEG data URL, for the gallery thumbnail. */
export function videoPoster(file, maxSide = 900) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const v = document.createElement('video')
    const done = (val) => {
      URL.revokeObjectURL(url)
      resolve(val)
    }
    v.muted = true
    v.playsInline = true
    v.preload = 'auto'
    v.onloadedmetadata = () => {
      v.currentTime = Math.min(1, (v.duration || 2) / 2)
    }
    v.onseeked = () => {
      try {
        const scale = Math.min(1, maxSide / Math.max(v.videoWidth, v.videoHeight))
        const c = document.createElement('canvas')
        c.width = Math.round(v.videoWidth * scale)
        c.height = Math.round(v.videoHeight * scale)
        c.getContext('2d').drawImage(v, 0, 0, c.width, c.height)
        done(c.toDataURL('image/jpeg', 0.72))
      } catch {
        done('')
      }
    }
    v.onerror = () => done('')
    setTimeout(() => done(''), 15000)
    v.src = url
  })
}
