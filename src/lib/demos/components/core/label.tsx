import { Input } from "@/lib/components/core/default/input";
import { Label } from "@/lib/components/core/default/label";

export default function LabelDemo() {
  return (
    <div>
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </div>
    </div>
  );
}