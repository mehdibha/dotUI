import { Checkbox } from "@/components/dynamic-core/checkbox";

export default function Demo() {
  return (
    <div className="space-y-4">
      <Checkbox variant="primary" defaultSelected>
        I agree to the terms and conditions
      </Checkbox>
      <Checkbox variant="accent" defaultSelected>
        I agree to the terms and conditions
      </Checkbox>
    </div>
  );
}
