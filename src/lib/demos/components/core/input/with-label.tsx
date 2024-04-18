import { Input } from "@/lib/components/core/default/input";
import { Label } from "@/lib/components/core/default/label";

export default function InputWithLabelDemo() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  );
}
