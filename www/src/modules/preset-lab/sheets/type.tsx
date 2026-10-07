import { Kbd } from "@/registry/ui/kbd"
import { Link } from "@/registry/ui/link"

import { Cell, Sheet } from "./layout"

export function TypeSheet() {
  return (
    <Sheet className="grid-cols-[1fr_420px]">
      <div className="flex flex-col gap-7">
        <Cell label="h1 · text-4xl">
          <h1 className="text-4xl">Build once, ship everywhere</h1>
        </Cell>
        <Cell label="h2 · text-3xl">
          <h2 className="text-3xl">A design system you own</h2>
        </Cell>
        <Cell label="h3 · text-2xl">
          <h3 className="text-2xl">Components that compose</h3>
        </Cell>
        <Cell label="h4 · text-xl">
          <h4 className="text-xl">Tokens, not hex codes</h4>
        </Cell>
        <Cell label="body · text-base">
          <p className="max-w-2xl text-base">
            Every visual decision is an axis: color, type, radius, density and
            per-component styles. Preview each change live on real components,
            then export code that reads like your own. Read the{" "}
            <Link href="#">quick start</Link> to begin.
          </p>
        </Cell>
        <Cell label="small · text-sm">
          <p className="max-w-2xl text-sm">
            The quick brown fox jumps over the lazy dog. 0123456789 — “quotes”,
            ellipsis…, and an ampersand &amp; for good measure.
          </p>
        </Cell>
        <Cell label="muted · text-sm text-fg-muted">
          <p className="max-w-2xl text-sm text-fg-muted">
            Last edited 3 minutes ago by Maya. Visible to everyone in Acme.
          </p>
        </Cell>
      </div>
      <div className="flex flex-col gap-7">
        <Cell label="caption · text-xs text-fg-muted">
          <p className="text-xs text-fg-muted">
            Updated Oct 6, 2026 · 4 min read
          </p>
        </Cell>
        <Cell label="inline code · kbd">
          <p className="text-sm">
            Run{" "}
            <code className="font-mono text-[0.9em]">pnpm dlx shadcn add</code>{" "}
            or press <Kbd>⌘</Kbd> <Kbd>K</Kbd>.
          </p>
        </Cell>
        <Cell label="code block · font-mono">
          <pre className="w-full overflow-hidden rounded-(--studio-radius-container) bg-muted p-4 font-mono text-[13px] leading-relaxed">
            {`import { Button } from "@/components/ui/button"

export function Save() {
  return <Button variant="primary">Save</Button>
}`}
          </pre>
        </Cell>
        <Cell label="weights · sans">
          <p className="flex flex-col text-lg">
            <span className="font-normal">Regular 400</span>
            <span className="font-medium">Medium 500</span>
            <span className="font-semibold">Semibold 600</span>
            <span className="font-bold">Bold 700</span>
          </p>
        </Cell>
      </div>
    </Sheet>
  )
}
