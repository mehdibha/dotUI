import { RadioGroup, Radio } from "@/registry/ui/default/core/radio-group";

export default function Demo() {
  return (
    <RadioGroup
      defaultValue="sm"
      label="Size"
      orientation="horizontal"
      variant="card"
    >
      <Radio value="sm">
        <div className="flex flex-col gap-1">
          <span className="font-bold">Small</span>
          <span className="text-fg-muted text-xs">Dimension: 128 x 128</span>
        </div>
      </Radio>
      <Radio value="md">
        <div className="flex flex-col gap-1">
          <span className="font-bold">Medium</span>
          <span className="text-fg-muted text-xs">Dimension: 256 x 256</span>
        </div>
      </Radio>
      <Radio value="lg">
        <div className="flex flex-col gap-1">
          <span className="font-bold">Large</span>
          <span className="text-fg-muted text-xs">Dimension: 512 x 512</span>
        </div>
      </Radio>
    </RadioGroup>
  );
}
