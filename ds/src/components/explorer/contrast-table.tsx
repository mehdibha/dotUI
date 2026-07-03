import type { ContrastPair } from '@/data/schema'
import { Badge } from '@/ui/badge'

interface ContrastTableProps {
  pairs: ContrastPair[]
}

/** Text/background pairings with live previews and their guarantee or measurement. */
export function ContrastTable({ pairs }: ContrastTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-xs text-fg-muted">
            <th className="px-3 py-2 font-medium">Preview</th>
            <th className="px-3 py-2 font-medium">Pairing</th>
            <th className="px-3 py-2 font-medium">Mode</th>
            <th className="px-3 py-2 font-medium">Result</th>
            <th className="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair, index) => (
            <tr
              key={`${pair.label}-${pair.mode}-${index}`}
              className="border-b last:border-b-0"
            >
              <td className="px-3 py-2">
                {pair.fgColor && pair.bgColor ? (
                  <span
                    className="inline-flex h-9 w-14 items-center justify-center rounded-md border text-sm font-medium"
                    style={{
                      backgroundColor: pair.bgColor,
                      color: pair.fgColor,
                    }}
                    title={`${pair.fgColor} on ${pair.bgColor}`}
                  >
                    Aa
                  </span>
                ) : (
                  <span className="text-xs text-fg-muted">—</span>
                )}
              </td>
              <td className="px-3 py-2">
                <span className="font-mono text-xs">{pair.label}</span>
                {pair.note && (
                  <p className="mt-0.5 max-w-sm text-xs text-fg-muted">
                    {pair.note}
                  </p>
                )}
              </td>
              <td className="px-3 py-2 text-xs text-fg-muted capitalize">
                {pair.mode ?? 'all'}
              </td>
              <td className="px-3 py-2">
                <span className="font-mono text-xs">
                  {pair.value}
                  <span className="ml-1.5 text-fg-muted uppercase">
                    {pair.metric}
                  </span>
                </span>
              </td>
              <td className="px-3 py-2">
                <Badge
                  appearance="subtle"
                  variant={pair.kind === 'measured' ? 'info' : 'success'}
                >
                  {pair.kind}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
