import { Input } from "@/lib/components/core/default/input";

export default function InputSizesDemo() {
  return (
    <div className="flex gap-4">
      <Input placeholder="small (sm)" size="sm" />
      <Input placeholder="medium (md)" size="md" />
      <Input placeholder="large (lg)" size="lg" />
    </div>
  );
}
