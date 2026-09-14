import { ToggleButton } from "@/registry/ui/toggle-button"

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <ToggleButton size="xs">Extra small</ToggleButton>
      <ToggleButton size="sm">Small</ToggleButton>
      <ToggleButton size="md">Medium</ToggleButton>
      <ToggleButton size="lg">Large</ToggleButton>
    </div>
  )
}
