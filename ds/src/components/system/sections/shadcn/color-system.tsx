'use client'

import { Block, Section } from '../../primitives'
import { BASE_COLORS, THEMES } from './data'
import { BASE_LABEL } from './shared'

/** Surface + foreground pairs that show off the convention. */
const PAIRS: { surface: string; fg: string }[] = [
  { surface: 'background', fg: 'foreground' },
  { surface: 'card', fg: 'card-foreground' },
  { surface: 'primary', fg: 'primary-foreground' },
  { surface: 'secondary', fg: 'secondary-foreground' },
  { surface: 'muted', fg: 'muted-foreground' },
  { surface: 'accent', fg: 'accent-foreground' },
]

export function ColorSystemSection() {
  return (
    <Section
      title="Color system"
      kicker="How it's built"
      intro="shadcn/ui doesn't generate a palette. It ships a fixed set of semantic CSS variables — borrowed from Tailwind's color scales — that you re-theme by swapping values. In v4 those values are OKLCH."
    >
      <Block
        title="Every surface has a foreground"
        description="Tokens come in pairs: a surface color and the -foreground meant to sit on it. Components reference the pair (bg-primary text-primary-foreground), so a re-theme never breaks contrast."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PAIRS.map(({ surface, fg }) => (
            <Pair key={surface} surface={surface} fg={fg} />
          ))}
        </div>
      </Block>

      <Block
        title="Light and dark"
        description="Values are defined once, then overridden under .dark. The token names never change — only what they resolve to."
      >
        <div className="grid grid-cols-2 gap-3 sm:max-w-md">
          <ModeCard mode="light" />
          <ModeCard mode="dark" />
        </div>
      </Block>

      <Block
        title="One real choice: the neutral base"
        description="The grays are the only thing you pick up front. Each base tints every neutral token toward a hue; the semantic structure is identical across all five."
      >
        <div className="flex flex-wrap gap-2">
          {BASE_COLORS.map((base) => (
            <div
              key={base}
              className="flex items-center gap-2 rounded-full border py-1 pr-3 pl-1.5"
            >
              <span
                className="size-5 rounded-full border"
                style={{ background: THEMES[base].light.secondary }}
              />
              <span className="text-xs font-medium">{BASE_LABEL[base]}</span>
            </div>
          ))}
        </div>
      </Block>
    </Section>
  )
}

/** A filled chip painted with a surface token, its text painted with the pair's foreground. */
function Pair({ surface, fg }: { surface: string; fg: string }) {
  const theme = THEMES.zinc.light
  return (
    <div
      className="flex h-20 flex-col justify-between rounded-lg border p-3"
      style={{ background: theme[surface], color: theme[fg] }}
    >
      <span className="text-lg font-semibold">Aa</span>
      <span className="font-mono text-[10px] opacity-70">
        {surface} · {fg}
      </span>
    </div>
  )
}

/** The primary pair shown in one mode, to make the light/dark swap concrete. */
function ModeCard({ mode }: { mode: 'light' | 'dark' }) {
  const theme = THEMES.zinc[mode]
  return (
    <div
      className="flex flex-col gap-3 rounded-lg border p-4"
      style={{ background: theme.background, color: theme.foreground }}
    >
      <span className="font-mono text-[10px] uppercase opacity-60">{mode}</span>
      <span
        className="rounded-md px-3 py-1.5 text-center text-xs font-medium"
        style={{
          background: theme.primary,
          color: theme['primary-foreground'],
        }}
      >
        Primary
      </span>
    </div>
  )
}
