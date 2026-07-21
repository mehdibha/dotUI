import { useEffect } from 'react'

import { familyFromStack, FONT_SANS_VAR, googleFontsUrl } from '@/lib/fonts'
import { PRESETS } from '@/modules/presets/presets-data'

/**
 * Display font for a preset's name in the landing switcher — the preset's own
 * body-font token, so labels always match the design system they open.
 * Presets without a font token label in the self-hosted default (Geist).
 */
export function presetLabelStack(presetId: string): string {
  const preset = PRESETS.find((p) => p.id === presetId)
  return (
    preset?.designSystem.tokens[FONT_SANS_VAR] ?? "'Geist Variable', sans-serif"
  )
}

/**
 * Lazy-loads the Google-hosted label fonts after idle: one stylesheet request,
 * subset via `text=` to just the glyphs the labels need (a few KB total),
 * `display=swap` so labels render immediately in the fallback font.
 */
export function usePresetLabelFonts() {
  useEffect(() => {
    const families = [
      ...new Set(
        PRESETS.map((p) => p.designSystem.tokens[FONT_SANS_VAR])
          .filter((stack): stack is string => stack !== undefined)
          .map(familyFromStack),
      ),
    ]
    if (families.length === 0) return

    const load = () => {
      if (document.getElementById('preset-label-fonts')) return
      const text = [...new Set(PRESETS.flatMap((p) => [...p.name]))].join('')
      const link = document.createElement('link')
      link.id = 'preset-label-fonts'
      link.rel = 'stylesheet'
      link.href = googleFontsUrl(families, { text })
      document.head.append(link)
    }

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(load)
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(load, 200)
    return () => clearTimeout(id)
  }, [])
}
