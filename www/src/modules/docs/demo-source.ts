/** Rewrite registry import paths to where a shadcn install puts them. Registry
 *  icon names are lucide's, the default library. */
export function toInstalledPaths(code: string): string {
  return code
    .replace(/@\/registry\/icons(?=["'])/g, "lucide-react")
    .replace(/@\/registry\/ui\//g, "@/components/ui/")
    .replace(/@\/registry\//g, "@/")
}

/** A demo's source as the docs display it. */
export function toDisplaySource(raw: string): string {
  return toInstalledPaths(raw)
    .replace("export default function", "export function")
    .replace(/\t/g, "  ")
    .trim()
}

/**
 * Registry items to install for a demo: its page item (`button` for
 * `button/demos/basic`) plus every other registry UI component its raw source
 * imports. A chart family already pulls in the chart core and its siblings.
 */
export function demoInstallItems(demoKey: string, raw: string): string[] {
  const page = demoKey.slice(0, demoKey.indexOf("/")) || demoKey
  const extras = new Set<string>()
  for (const [, name] of raw.matchAll(/@\/registry\/ui\/([a-z0-9-]+)/g)) {
    if (!name || name === page) continue
    if (page.startsWith("chart-") && name.startsWith("chart")) continue
    extras.add(name)
  }
  return [page, ...[...extras].sort()]
}
