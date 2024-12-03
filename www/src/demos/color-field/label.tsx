import { ColorField } from "@/registry/ui/default/core/color-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <ColorField label="Background" placeholder="Visible label" />
      <ColorField aria-label="Background" placeholder="Hidden label" />
    </div>
  );
}
