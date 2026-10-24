/** Image upload/compression helpers. Everything stays on-device. */
export const MAX_INPUT = 25 * 1024 * 1024

export const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('That image could not be opened.'))
    img.src = src
  })

/**
 * Compress to a web-friendly data URL.
 * opts: { max = 1600, quality = 0.86, square = false }
 */
export const compressImage = async (file, opts = {}) => {
  if (!file) throw new Error('No file selected.')
  if (file.type && !file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (JPG, PNG, WebP, GIF, HEIC).')
  }
  if (file.size > MAX_INPUT) throw new Error('That image is larger than 25 MB. Try a smaller one.')
  const dataUrl = await readFileAsDataURL(file)
  // GIFs keep their animation; everything else is resized/compressed.
  if (file.type === 'image/gif' && file.size < 6 * 1024 * 1024) return dataUrl
  try {
    const { max = 1600, quality = 0.86, square = false } = opts
    const img = await loadImage(dataUrl)
    let w = img.naturalWidth
    let h = img.naturalHeight
    const scale = Math.min(1, max / Math.max(w, h))
    w = Math.round(w * scale)
    h = Math.round(h * scale)
    let sx = 0
    let sy = 0
    let sw = img.naturalWidth
    let sh = img.naturalHeight
    if (square) {
      const side = Math.min(sw, sh)
      sx = (sw - side) / 2
      sy = (sh - side) / 2
      sw = side
      sh = side
      const out = Math.min(max, 1200)
      w = out
      h = out
    }
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
    const isPng = file.type === 'image/png' && file.size < 700 * 1024
    return canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality)
  } catch {
    return dataUrl
  }
}

export const pickImages = (input) =>
  new Promise((resolve) => {
    const el = document.createElement('input')
    el.type = 'file'
    el.accept = 'image/*'
    el.multiple = true
    el.onchange = () => resolve(Array.from(el.files || []))
    el.oncancel = () => resolve([])
    el.click()
  })

export const pickFile = (accept = 'application/json') =>
  new Promise((resolve) => {
    const el = document.createElement('input')
    el.type = 'file'
    el.accept = accept
    el.onchange = () => resolve(el.files?.[0] || null)
    el.oncancel = () => resolve(null)
    el.click()
  })

export const dataUrlBytes = (dataUrl = '') => {
  const base64 = dataUrl.split(',')[1] || ''
  return Math.round((base64.length * 3) / 4)
}

export const prettyBytes = (bytes = 0) => {
  if (!bytes) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}
