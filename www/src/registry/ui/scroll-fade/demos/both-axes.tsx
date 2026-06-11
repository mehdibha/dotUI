import { ScrollFade } from '@/registry/ui/scroll-fade'

const rows = Array.from({ length: 12 }, (_, row) =>
  Array.from({ length: 8 }, (_, column) => `R${row + 1} C${column + 1}`),
)

export default function Demo() {
  return (
    <ScrollFade className="h-56 w-full max-w-md rounded-lg border bg-bg">
      <div className="grid w-max grid-cols-8 gap-px p-3">
        {rows.flat().map((cell) => (
          <div
            key={cell}
            className="flex h-10 w-28 items-center rounded-sm bg-muted px-3 text-sm"
          >
            {cell}
          </div>
        ))}
      </div>
    </ScrollFade>
  )
}
