import { Badge } from "@/registry/ui/badge"
import { Section } from "~/components/system/primitives"
import { CORE_COMPONENTS, MODES, STATES } from "~/data/looks"
import type { Look, LooksFile, Reading } from "~/data/looks"

import { Copy } from "./copy"
import { Empty, Swatch } from "./sections"

/** The values a look is read by, in the order they show. */
const KEY_VALUES = [
  "backgroundColor",
  "color",
  "edge",
  "borderRadius",
  "height",
  "paddingInline",
  "fontSize",
  "fontWeight",
  "boxShadow",
]

/** rgb() as hex, which fits a narrow column. */
const short = (value: string) =>
  value.replace(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g,
    (_, r: string, g: string, b: string, a?: string) =>
      `#${[
        r,
        g,
        b,
        ...(a === undefined ? [] : [String(Math.round(Number(a) * 255))]),
      ]
        .map((n) => Number(n).toString(16).padStart(2, "0"))
        .join("")}`,
  )

const isColor = (value: string) =>
  /^(rgb|oklab|oklch|#|hsl|color\()/.test(value)

function Value({ value }: { value: string }) {
  const color = isColor(value)
    ? value
    : /\s((rgb|oklab|oklch)\(.*\))$/.exec(value)?.[1]
  return (
    <span className="inline-flex items-center gap-1.5 font-mono">
      {color && <Swatch color={color} size={12} />}
      {short(value)}
    </span>
  )
}

export function ComponentsSection({ looks }: { looks: LooksFile }) {
  const keys = [
    ...CORE_COMPONENTS,
    ...Object.keys(looks.components).filter(
      (k) => !CORE_COMPONENTS.includes(k),
    ),
  ]
  return (
    <Section
      title="Components"
      intro="Each look the census found, as their own element frozen with its computed styles, at rest and in each state it read, in light and dark."
    >
      {keys.map((key) => {
        const entry = looks.components[key]
        return (
          <section
            key={key}
            id={`component-${key}`}
            className="flex flex-col gap-4"
          >
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t pt-4">
              <h3 className="text-base font-semibold">{key}</h3>
              {entry && (
                <span className="text-xs text-fg-muted">
                  {entry.looks.length} of {entry.found} looks ·{" "}
                  {entry.groups.join(", ")}
                </span>
              )}
            </header>
            {entry?.looks.length ? (
              entry.looks.map((look) => (
                <LookCard key={look.id} slug={looks.slug} look={look} />
              ))
            ) : (
              <Empty>No {key} found on the pages read.</Empty>
            )}
          </section>
        )
      })}
    </Section>
  )
}

function LookCard({ slug, look }: { slug: string; look: Look }) {
  const states = STATES.filter((state) => look.states[state])
  return (
    <article className="grid gap-x-6 gap-y-3 rounded-lg border p-4 md:grid-cols-2">
      <header className="flex flex-wrap items-center gap-2 md:col-span-2">
        <span className="font-mono text-sm">{look.id}</span>
        <span className="text-xs text-fg-muted">
          ×{look.count} on {look.pages.length}{" "}
          {look.pages.length === 1 ? "page" : "pages"}
        </span>
        {look.is && (
          <Badge appearance="outline" size="sm">
            only {look.is}
          </Badge>
        )}
        {look.part && (
          <Badge appearance="soft" size="sm">
            probe {look.part}
          </Badge>
        )}
        {look.off?.length ? (
          <Badge appearance="soft" variant="warning" size="sm">
            {look.off.length} off
          </Badge>
        ) : null}
      </header>
      <div
        className="grid content-start gap-2"
        style={{
          gridTemplateColumns: `2.5rem repeat(${states.length}, minmax(0, 1fr))`,
        }}
      >
        <span />
        {states.map((state) => (
          <span key={state} className="text-xs text-fg-muted">
            {state}
          </span>
        ))}
        {MODES.map((mode) => (
          <ModeRow
            key={mode}
            slug={slug}
            look={look}
            mode={mode}
            states={states}
          />
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        <Values look={look} />
        {look.off?.length ? <Off look={look} /> : null}
      </div>
    </article>
  )
}

function ModeRow({
  slug,
  look,
  mode,
  states,
}: {
  slug: string
  look: Look
  mode: (typeof MODES)[number]
  states: (typeof STATES)[number][]
}) {
  return (
    <>
      <span className="pt-2 text-xs text-fg-muted">{mode}</span>
      {states.map((state) => {
        const reading = look.states[state]?.[mode]
        return (
          <div key={state} className="flex min-w-0 flex-col gap-1">
            {reading?.copy ? (
              <Copy
                slug={slug}
                path={reading.copy}
                className="min-h-14 overflow-hidden rounded-md border"
              />
            ) : (
              <p className="rounded-md border border-dashed p-3 text-xs text-fg-muted">
                {reading ? "no copy" : "not read"}
              </p>
            )}
            {reading?.forced && (
              <span
                className="text-[11px] text-fg-muted"
                title="Read by setting the state on the element: no element on the page showed it."
              >
                set by the capture
              </span>
            )}
            {state !== "rest" && reading && <Delta reading={reading} />}
          </div>
        )
      })}
    </>
  )
}

function Delta({ reading }: { reading: Reading }) {
  return (
    <ul className="text-[11px] leading-tight">
      {Object.entries(reading.values).map(([prop, value]) => (
        <li key={prop} className="truncate">
          <span className="text-fg-muted">{prop}</span> <Value value={value} />
        </li>
      ))}
    </ul>
  )
}

function Values({ look }: { look: Look }) {
  const rest = look.states.rest
  if (!rest) return null
  return (
    <table className="w-full text-left text-[11px]">
      <tbody>
        {KEY_VALUES.map((prop) => (
          <tr key={prop} className="border-t">
            <td className="py-1 pr-3 align-top text-fg-muted">{prop}</td>
            {MODES.map((mode) => {
              const value = rest[mode]?.values[prop]
              const token = rest[mode]?.vars?.[prop]
              return (
                <td key={mode} className="py-1 pr-3 align-top break-words">
                  {value ? <Value value={value} /> : "—"}
                  {token && (
                    <span className="block text-fg-muted">{token}</span>
                  )}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Off({ look }: { look: Look }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium">Where the preset is off</p>
      <table className="w-full text-left text-[11px]">
        <thead className="text-fg-muted">
          <tr>
            <th className="py-1 pr-4 font-normal">value</th>
            <th className="py-1 pr-4 font-normal">theirs</th>
            <th className="py-1 font-normal">ours</th>
          </tr>
        </thead>
        <tbody>
          {look.off?.map((row, i) => (
            <tr key={i} className="border-t">
              <td className="py-1 pr-4 text-fg-muted">
                {row.prop} · {row.mode}
                {row.state !== "rest" && ` · ${row.state}`}
              </td>
              <td className="py-1 pr-4">
                <Value value={row.theirs} />
              </td>
              <td className="py-1">
                <Value value={row.ours} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
