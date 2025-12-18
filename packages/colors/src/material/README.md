# Material HCT Theme Generator

Generate color themes using Material Design 3's HCT (Hue, Chroma, Tone) color space.

## API

```typescript
import { createTheme, createThemeOptionsSchema, type CreateThemeOptions } from '@dotui/colors/material';

const theme = createTheme({
  palettes: {
    // Primary (required) - any color format
    primary: '#6366f1',
    primary: 'rgb(99, 102, 241)',
    primary: 'hsl(239, 84%, 67%)',
    primary: 'oklch(0.65 0.25 264)',
    primary: { color: '#6366f1', tones: [99, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10] },

    // Neutral (optional) - auto-generated from primary if not provided
    neutral: '#64748b',
    neutral: { color: '#64748b', tones: [...] },

    // Other palettes - boolean | string | { color, tones? }
    success: true,                         // use default hue (142°)
    success: false,                        // skip this palette
    success: '#22c55e',                    // use this color
    success: { color: '#22c55e' },         // same as string
    success: { color: '#22c55e', tones: [...] },  // custom tones

    // Custom palettes
    brand: '#ff6b00',
    accent: { color: 'oklch(0.7 0.15 200)', tones: [...] },
  },

  modes: {
    light: true,
    dark: true,
    'high-contrast': { isDark: false, contrast: 0.5 },
    'deuteranopia': {
      isDark: false,
      palettes: {
        success: { hue: 220 },
        danger: { hue: 320, chroma: 60 },
      },
    },
  },

  variant: 'tonalSpot',    // optional
  contrast: 0,             // optional, -1 to 1
  tones: [...],            // optional, global default
});
```

## Output

```typescript
{
  light: {
    scales: {
      primary: { '50': '#...', '100': '#...', ..., '950': '#...' },
      neutral: { ... },
      success: { ... },
    }
  },
  dark: { scales: { ... } },
}
```

## Implementation Plan

### Phase 1: Schema
- [ ] `createThemeOptionsSchema` - validate input
- [ ] `CreateThemeOptions` - TypeScript type
- [ ] Support multiple color formats via colorjs.io

### Phase 2: Core Generation
- [ ] Parse color → convert to HCT
- [ ] Generate neutral from primary
- [ ] Generate semantic palettes
- [ ] Generate 11-step scales

### Phase 3: Modes
- [ ] Light/dark default tones
- [ ] Custom modes with isDark
- [ ] Mode palette overrides

### Phase 4: Variants & Contrast
- [ ] Apply variant to chroma
- [ ] Apply contrast to tones

## Files

- `schema.ts` - Zod schema
- `index.ts` - createTheme function
- `defaults.ts` - default values
