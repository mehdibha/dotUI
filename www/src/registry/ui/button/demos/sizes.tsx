import { Button } from "@/registry/ui/button"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
}
