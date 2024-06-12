import { ColorField } from "@/lib/components/core/default/color-field";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <ColorField label="small (sm)" size="sm" />
      <ColorField label="medium (md)" size="md" />
      <ColorField label="large (lg)" size="lg" />
    </div>
  );
}
