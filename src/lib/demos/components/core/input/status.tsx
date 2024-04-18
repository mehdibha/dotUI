import { Input } from "@/lib/components/core/default/input";

export default function InputStatusDemo() {
  return (
    <div className="w-full space-y-2">
      <Input type="email" status="success" />
      <Input type="email" status="error" />
    </div>
  );
}
