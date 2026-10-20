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
 * `button/demos/basic`, the `chart` kit for a chart recipe) plus every other
 * registry UI component its raw source imports.
 */
export function demoInstallItems(demoKey: string, raw: string): string[] {
  const folder = demoKey.slice(0, demoKey.indexOf("/")) || demoKey
  const page = folder.startsWith("chart-") ? "chart" : folder
  const extras = new Set<string>()
  for (const [, name] of raw.matchAll(/@\/registry\/ui\/([a-z0-9-]+)/g)) {
    if (name && name !== page) extras.add(name)
  }
  return [page, ...[...extras].sort()]
}
