import { ColorField } from "@/components/dynamic-ui/color-field";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <ColorField label="small" size="sm" />
      <ColorField label="medium" size="md" />
      <ColorField label="large" size="lg" />
    </div>
  );
}
