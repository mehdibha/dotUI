import type { ReactNode } from "react"

import { Badge } from "@/registry/ui/badge"
import { Block, Section } from "~/components/system/primitives"
import { COLOR_ROLES, CORE_COMPONENTS, MODES, STATES } from "~/data/looks"
import type { LooksFile } from "~/data/looks"

/* The foundation sections of a captured system's page. Every list shows what
   the capture found, and what it didn't as an empty slot, so the page says
   how deep the capture went. */

export function Swatch({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <span
      title={color}
      className="inline-block shrink-0 rounded-sm border border-border/60 align-middle"
      style={{ backgroundColor: color, width: size, height: size }}
    />
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-dashed px-3 py-2 text-sm text-fg-muted">
      {children}
    </p>
  )
}

function Stat({
  label,
  value,
  of,
  note,
}: {
  label: string
  value: number | string
  of?: number
  note?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border p-4">
      <p className="text-xs text-fg-muted">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">
        {value}
        {of !== undefined && (
          <span className="text-base font-normal text-fg-muted"> / {of}</span>
        )}
      </p>
      {note && <p className="text-xs text-fg-muted">{note}</p>}
    </div>
  )
}

export function CoverageSection({ looks }: { looks: LooksFile }) {
  const { capture, color, components } = looks
  const all = Object.values(components).flatMap((c) => c.looks)
  const found = Object.values(components).reduce((n, c) => n + c.found, 0)
  const signedIn = capture.pages.filter((p) => p.signedIn).length
  const roles = (mode: (typeof MODES)[number]) =>
    Object.keys(color.modes[mode]?.roles ?? {}).length
  const core = CORE_COMPONENTS.filter((c) => components[c]?.looks.length)
  const offLooks = all.filter((l) => l.off?.length)

  return (
    <Section
      title="Coverage"
      intro={`Read on ${capture.date} by preset-lab ${capture.probe}. Every number is something the capture measured; the empty slots further down are what it didn't reach.`}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat
          label="Pages read"
          value={capture.pages.length}
          note={`${signedIn} signed in · ${MODES.filter((m) => capture.pages.some((p) => p.modes.includes(m))).join(" + ")}`}
        />
        <Stat
          label="Color roles"
          value={roles("light")}
          of={COLOR_ROLES.length}
          note={`dark ${roles("dark")} / ${COLOR_ROLES.length}`}
        />
        <Stat
          label="Core components"
          value={core.length}
          of={CORE_COMPONENTS.length}
          note={`${Object.keys(components).length} groups with looks`}
        />
        <Stat
          label="Looks shown"
          value={all.length}
          of={found}
          note={`${all.filter((l) => l.part).length} measured on both sides`}
        />
        <Stat
          label="Off in the preset"
          value={offLooks.length}
          note={`looks, ${offLooks.reduce((n, l) => n + (l.off?.length ?? 0), 0)} values`}
        />
      </div>
      <Block title="States" description="Looks with a reading in each state.">
        <div className="flex flex-wrap gap-2">
          {STATES.map((state) => {
            const n = all.filter((l) => l.states[state]).length
            return (
              <Badge
                key={state}
                appearance={n ? "soft" : "outline"}
                variant={n ? "neutral" : "warning"}
              >
                {state} {n}
              </Badge>
            )
          })}
        </div>
      </Block>
      <Block title="Not captured yet">
        <div className="flex flex-wrap gap-2">
          {capture.missing.map((what) => (
            <Badge key={what} appearance="outline" variant="warning">
              {what}
            </Badge>
          ))}
        </div>
      </Block>
    </Section>
  )
}

export function ColorSection({ looks }: { looks: LooksFile }) {
  const { modes, tokens } = looks.color
  return (
    <Section title="Color">
      <Block title="Roles">
        <table className="w-full max-w-2xl text-left text-sm">
          <thead className="text-xs text-fg-muted">
            <tr>
              <th className="py-1 font-normal">Role</th>
              {MODES.map((mode) => (
                <th key={mode} className="py-1 font-normal">
                  {mode}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COLOR_ROLES.map((role) => (
              <tr key={role} className="border-t">
                <td className="py-1.5 pr-4">{role}</td>
                {MODES.map((mode) => {
                  const found = modes[mode]?.roles?.[role]
                  return (
                    <td key={mode} className="py-1.5 pr-4">
                      {found ? (
                        <span className="flex items-center gap-2 font-mono text-xs">
                          <Swatch color={found.color} />
                          {found.color}
                        </span>
                      ) : (
                        <span className="text-xs text-fg-muted">not found</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Block>
      {MODES.map((mode) => {
        const palette = modes[mode]
        if (!palette) return <Empty key={mode}>No {mode} palette read.</Empty>
        return (
          <Block
            key={mode}
            title={`Palette, ${mode}`}
            description="Neutrals by lightness, then each accent hue. Hover a swatch for its value."
          >
            <div className="flex flex-col gap-3">
              <Strip
                label="neutrals"
                colors={[...palette.neutrals].sort((a, b) => b.l - a.l)}
              />
              {palette.accents.map((accent) => (
                <Strip
                  key={accent.hue}
                  label={`hue ${accent.hue}`}
                  colors={[...accent.steps].sort((a, b) => b.l - a.l)}
                />
              ))}
            </div>
          </Block>
        )
      })}
      <Block
        title="Custom properties"
        description={`The ${Math.min(tokens.length, 30)} that feed the most elements, of ${tokens.length}.`}
      >
        <table className="w-full text-left text-xs">
          <tbody>
            {tokens.slice(0, 30).map((token) => (
              <tr key={token.name} className="border-t align-top">
                <td className="py-1.5 pr-4 font-mono">{token.name}</td>
                <td className="py-1.5 pr-4 text-fg-muted tabular-nums">
                  {token.count}
                </td>
                {MODES.map((mode) => (
                  <td key={mode} className="py-1.5 pr-4 font-mono">
                    {token[mode]}
                  </td>
                ))}
                <td className="py-1.5 text-fg-muted">
                  {token.feeds.slice(0, 3).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Block>
    </Section>
  )
}

function Strip({
  label,
  colors,
}: {
  label: string
  colors: { color: string; count: number; uses: string[] }[]
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 font-mono text-xs text-fg-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {colors.map((c) => (
          <span
            key={c.color}
            title={`${c.color} · ${c.count} uses · ${c.uses.slice(0, 3).join(", ")}`}
            className="size-7 rounded-sm border border-border/60"
            style={{ backgroundColor: c.color }}
          />
        ))}
      </div>
    </div>
  )
}

export function TypeSection({ looks }: { looks: LooksFile }) {
  const { families, styles } = looks.type
  return (
    <Section title="Type">
      <Block title="Families">
        <p className="text-sm">
          {families.map((f) => `${f.family} (${f.count})`).join(" · ")}
        </p>
      </Block>
      <Block
        title="Styles"
        description="Each distinct size, weight and line height, most used first. The sample uses their family when this browser has it."
      >
        <table className="w-full text-left text-sm">
          <tbody>
            {styles.map((style, i) => (
              <tr key={i} className="border-t align-middle">
                <td className="py-2 pr-4">
                  <span
                    style={{
                      fontSize: style.fontSize,
                      fontWeight: style.fontWeight,
                      lineHeight: style.lineHeight,
                      letterSpacing: style.letterSpacing,
                      fontFamily: style.fontFamily,
                      textTransform: style.textTransform as never,
                    }}
                  >
                    Ag
                  </span>
                </td>
                <td className="py-2 pr-4 font-mono text-xs">
                  {style.fontSize} / {style.lineHeight ?? "normal"} ·{" "}
                  {style.fontWeight}
                </td>
                <td className="py-2 pr-4 text-xs text-fg-muted tabular-nums">
                  {style.count}
                </td>
                <td className="py-2 text-xs text-fg-muted">
                  {style.groups.slice(0, 5).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Block>
    </Section>
  )
}

export function ShapeSection({ looks }: { looks: LooksFile }) {
  const { radius, pills } = looks.shape
  return (
    <Section title="Shape">
      <Block title="Corner radii" description="Most used first.">
        <div className="flex flex-wrap gap-4">
          {radius.map((r) => (
            <div key={r.px} className="flex w-32 flex-col gap-2">
              <div
                className="h-14 border-2 border-fg/70 bg-muted"
                style={{ borderRadius: r.px }}
              />
              <p className="font-mono text-xs">
                {r.px}px <span className="text-fg-muted">×{r.count}</span>
              </p>
              <p className="text-xs text-fg-muted">
                {r.groups.slice(0, 4).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </Block>
      <Block
        title="Pills"
        description="Groups that round the whole end of their box."
      >
        {pills.length ? (
          <p className="text-sm">{pills.join(", ")}</p>
        ) : (
          <Empty>No pills found.</Empty>
        )}
      </Block>
    </Section>
  )
}

export function SpacingSection({ looks }: { looks: LooksFile }) {
  const { grid, steps, heights } = looks.spacing
  const most = Math.max(...steps.map((s) => s.count), 1)
  return (
    <Section
      title="Spacing"
      intro={`Gaps and paddings fall on a ${grid}px grid.`}
    >
      <Block title="Steps">
        <div className="flex flex-col gap-1">
          {steps.map((s) => (
            <div key={s.px} className="flex items-center gap-3 text-xs">
              <span className="w-12 shrink-0 text-right font-mono">
                {s.px}px
              </span>
              <span
                className="h-3 rounded-sm bg-fg/70"
                style={{ width: `${(s.count / most) * 60}%` }}
              />
              <span className="text-fg-muted tabular-nums">{s.count}</span>
            </div>
          ))}
        </div>
      </Block>
      <Block title="Control heights">
        <table className="text-left text-xs">
          <tbody>
            {Object.entries(heights).map(([group, list]) => (
              <tr key={group} className="border-t">
                <td className="py-1.5 pr-6">{group}</td>
                <td className="py-1.5 font-mono">
                  {list.map((h) => `${h.px}px ×${h.count}`).join(" · ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Block>
    </Section>
  )
}

export function ElevationSection({ looks }: { looks: LooksFile }) {
  // A shadow drawn in a transparent color shows nothing.
  const shadows = looks.elevation.shadows.filter(
    (s) => !/^rgba\([^)]*,\s*0\)\s/.test(s.value),
  )
  return (
    <Section title="Elevation">
      {shadows.length ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {shadows.map((s) => (
            <div key={s.value} className="flex flex-col gap-2">
              <div
                className="h-16 rounded-md bg-bg"
                style={{ boxShadow: s.value }}
              />
              <p className="font-mono text-[11px] break-all text-fg-muted">
                {s.value}
              </p>
              <p className="text-xs text-fg-muted">
                ×{s.count} · {s.groups.slice(0, 3).join(", ")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <Empty>No visible shadows found.</Empty>
      )}
    </Section>
  )
}

export function GapsSection({ looks }: { looks: LooksFile }) {
  return (
    <Section
      title="Gaps"
      intro="Looks the preset can't reach because no studio axis covers them, from the preset's gap ledger."
    >
      {looks.gaps.length ? (
        <ul className="flex flex-col gap-4">
          {looks.gaps.map((gap, i) => (
            <li key={i} className="flex flex-col gap-1 border-t pt-3">
              <p className="text-sm font-medium">
                {gap.title}{" "}
                <span className="font-mono text-xs font-normal text-fg-muted">
                  {gap.look}
                </span>
              </p>
              {gap.note && <p className="text-sm text-fg-muted">{gap.note}</p>}
              {gap.standin && (
                <p className="text-xs text-fg-muted">Stand-in: {gap.standin}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No gaps recorded.</Empty>
      )}
    </Section>
  )
}

export function PagesSection({ looks }: { looks: LooksFile }) {
  return (
    <Section title="Pages read">
      <ol className="flex flex-col gap-1 text-xs">
        {looks.capture.pages.map((page, i) => (
          <li key={page.key} className="flex gap-3">
            <span className="w-6 shrink-0 text-right text-fg-muted tabular-nums">
              {i}
            </span>
            <span className="min-w-0 font-mono break-all">{page.key}</span>
            <span className="ml-auto shrink-0 text-fg-muted">
              {page.modes.join(" + ")} ·{" "}
              {page.signedIn ? "signed in" : page.how}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  )
}
