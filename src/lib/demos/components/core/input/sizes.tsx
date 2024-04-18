import { Input } from "@/lib/components/core/default/input";

export default function InputSizesDemo() {
  return (
    <div className="flex gap-4">
      <Input placeholder="sm" size="sm" />
      <Input placeholder="md" size="md" />
      <Input placeholder="lg" size="lg" />
    </div>
  );
}
