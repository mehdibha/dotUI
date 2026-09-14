import { ToggleButton } from "@/registry/ui/toggle-button"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <ToggleButton variant="primary">Primary</ToggleButton>
      <ToggleButton variant="secondary">Secondary</ToggleButton>
      <ToggleButton variant="quiet">Quiet</ToggleButton>
    </div>
  )
}
