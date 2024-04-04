import { Input } from "@/lib/components/core/default/input";
import { Label } from "@/lib/components/core/default/label";

export default function LabelDemo() {
  return (
    <div>
      <div className="flex items-center space-x-4">
        <Label htmlFor="name">Name</Label>
        <Input id="name" />
      </div>
    </div>
  );
}
