import { useEffect } from 'react'

import { PRESETS } from '@/modules/presets/presets-data'

/**
 * Display font for each preset's name in the landing switcher — the font the
 * real brand uses for UI text (or the closest Google Fonts stand-in when the
 * brand font is proprietary). Site-only presentation; not a design-system axis.
 *
 * `google` is the exact Google Fonts family to lazy-load; omitted when the
 * font is already self-hosted (Geist) or inherited.
 */
export const PRESET_LABEL_FONTS: Record<
  string,
  { stack: string; google?: { family: string; weight: string } }
> = {
  // dotUI + Vercel both use Geist — already self-hosted via fontsource.
  default: { stack: "'Geist Variable', sans-serif" },
  vercel: { stack: "'Geist Variable', sans-serif" },
  // Verified against live production CSS: Supabase and Linear ship Inter,
  // Material 3's default typeface is Roboto.
  supabase: {
    stack: "'Inter', sans-serif",
    google: { family: 'Inter', weight: '500' },
  },
  material: {
    stack: "'Roboto', sans-serif",
    google: { family: 'Roboto', weight: '500' },
  },
  linear: {
    stack: "'Inter', sans-serif",
    google: { family: 'Inter', weight: '500' },
  },
  // Claude's real UI font is Anthropic Sans (custom, BSPK) — proprietary;
  // Space Grotesk is the closest free grotesque.
  claude: {
    stack: "'Space Grotesk', sans-serif",
    google: { family: 'Space Grotesk', weight: '500' },
  },
  // Fictional presets: fonts picked to match their descriptions.
  rose: {
    stack: "'Nunito', sans-serif",
    google: { family: 'Nunito', weight: '500' },
  },
  contrast: {
    stack: "'Atkinson Hyperlegible Next', sans-serif",
    google: { family: 'Atkinson Hyperlegible Next', weight: '500' },
  },
}

/**
 * Lazy-loads the Google-hosted label fonts after idle: one stylesheet request,
 * subset via `text=` to just the glyphs the labels need (a few KB total),
 * `display=swap` so labels render immediately in the fallback font.
 */
export function usePresetLabelFonts() {
  useEffect(() => {
    const families = [
      ...new Map(
        Object.values(PRESET_LABEL_FONTS)
          .map((font) => font.google)
          .filter((google) => google !== undefined)
          .map((google) => [google.family, google]),
      ).values(),
    ]
    if (families.length === 0) return

    const load = () => {
      if (document.getElementById('preset-label-fonts')) return
      const text = [...new Set(PRESETS.flatMap((p) => [...p.name]))].join('')
      const params = families
        .map((g) => `family=${g.family.replaceAll(' ', '+')}:wght@${g.weight}`)
        .join('&')
      const link = document.createElement('link')
      link.id = 'preset-label-fonts'
      link.rel = 'stylesheet'
      link.href = `https://fonts.googleapis.com/css2?${params}&display=swap&text=${encodeURIComponent(text)}`
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
