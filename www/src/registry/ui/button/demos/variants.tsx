import { Button } from "@/registry/ui/button"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="quiet">Quiet</Button>
      <Button variant="link">Link</Button>
      <Button variant="warning">Warning</Button>
      <Button variant="danger">Danger</Button>
    </div>
  )
}
