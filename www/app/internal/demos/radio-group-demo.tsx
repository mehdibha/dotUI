import { Radio, RadioGroup } from "@dotui/registry-v2/ui/radio-group";

export function RadioGroupDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <RadioGroup label="Default">
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
        <RadioGroup label="Invalid" isInvalid>
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
        <RadioGroup
          label="Error message"
          isInvalid
          errorMessage="Please select a size"
        >
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
        <RadioGroup label="Disabled" isDisabled>
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
        <RadioGroup label="Read only" isReadOnly>
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
        <RadioGroup label="Description" description="Please select a size">
          <Radio value="sm">Small</Radio>
          <Radio value="md">Medium</Radio>
          <Radio value="lg">Large</Radio>
        </RadioGroup>
      </div>
      <RadioGroup
        label="Plan"
        description="Please select a plan"
        variant="card"
        orientation="vertical"
        className="items-start"
      >
        <Radio value="Starter pack">
          <div className="flex-1">
            <div className="font-bold">Starter pack</div>
            <div className="text-xs text-fg-muted">
              Perfect for small businesses starting out.
            </div>
          </div>
        </Radio>
        <Radio value="Pro pack">
          <div className="flex-1">
            <div className="font-bold">Pro pack</div>
            <div className="text-xs text-fg-muted">
              Perfect for growing businesses.
            </div>
          </div>
        </Radio>
      </RadioGroup>
    </div>
  );
}
