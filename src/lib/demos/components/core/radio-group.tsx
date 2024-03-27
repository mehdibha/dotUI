import { Label } from "@/lib/components/core/default/label";
import { RadioGroup, RadioGroupItem } from "@/lib/components/core/default/radio-group";

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-3">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1" className="text-lg">
          Default
        </Label>
      </div>
      <div className="flex items-center space-x-3">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2" className="text-lg">
          Comfortable
        </Label>
      </div>
      <div className="flex items-center space-x-3">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3" className="text-lg">
          Compact
        </Label>
      </div>
    </RadioGroup>
  );
}
