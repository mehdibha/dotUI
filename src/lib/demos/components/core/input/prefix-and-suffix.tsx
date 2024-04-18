import { DollarSignIcon, XCircleIcon } from "lucide-react";
import { Input } from "@/lib/components/core/default/input";

export default function InputPrefixAndSuffixDemo() {
  return (
    <div className="w-full space-y-2">
      <Input type="number" prefix={<DollarSignIcon />} />
      <Input suffix={<span>minutes</span>} />
      <Input suffix={<XCircleIcon />} />
    </div>
  );
}
