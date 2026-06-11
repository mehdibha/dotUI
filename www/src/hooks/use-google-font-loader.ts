const loadedFonts = new Set<string>()
let pendingFonts: string[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

function flush() {
  if (pendingFonts.length === 0) return

  const batch = [...pendingFonts]
  pendingFonts = []
  flushTimer = null

  const families = batch
    .map((name) => `family=${encodeURIComponent(name)}`)
    .join('&')
  const textChars = [...new Set(batch.join(''))].join('')
  const url = `https://fonts.googleapis.com/css2?${families}&display=swap&text=${encodeURIComponent(textChars)}`

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}

export function loadFont(name: string) {
  if (loadedFonts.has(name)) return
  loadedFonts.add(name)
  pendingFonts.push(name)

  if (!flushTimer) {
    flushTimer = setTimeout(flush, 80)
  }
}

export function loadFontFull(name: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@400;500;600;700&display=swap`
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = url
  document.head.appendChild(link)
}
