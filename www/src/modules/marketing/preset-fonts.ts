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
  // Vercel uses Geist — already self-hosted via fontsource.
  vercel: { stack: "'Geist Variable', sans-serif" },
  // Verified against live production CSS: Supabase and Linear ship Inter.
  supabase: {
    stack: "'Inter', sans-serif",
    google: { family: 'Inter', weight: '500' },
  },
  // Stripe's UI font is Söhne — proprietary; Inter is the closest free grotesque.
  stripe: {
    stack: "'Inter', sans-serif",
    google: { family: 'Inter', weight: '500' },
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
  // Airbnb Cereal is proprietary; Plus Jakarta Sans is the closest free match.
  airbnb: {
    stack: "'Plus Jakarta Sans', sans-serif",
    google: { family: 'Plus Jakarta Sans', weight: '500' },
  },
  // GitHub's brand font, open-sourced and on Google Fonts.
  github: {
    stack: "'Mona Sans', sans-serif",
    google: { family: 'Mona Sans', weight: '500' },
  },
  // Notion renders in the platform system font.
  notion: { stack: 'ui-sans-serif, system-ui, sans-serif' },
  // Spotify Circular is proprietary; Figtree is the closest free geometric.
  spotify: {
    stack: "'Figtree', sans-serif",
    google: { family: 'Figtree', weight: '500' },
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
