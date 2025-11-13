import {
  Description,
  FieldContent,
  FieldGroup,
  Label,
} from "@dotui/registry/ui/field";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
} from "@dotui/registry/ui/radio-group";

export function RadioGroupDemo() {
  return (
    <div className="space-y-4">
      <RadioGroup>
        <Label>Size</Label>
        <FieldGroup className="gap-1">
          <Radio value="sm">
            <RadioIndicator />
            Small
          </Radio>
          <Radio value="md">
            <RadioIndicator />
            Medium
          </Radio>
          <Radio value="lg">
            <RadioIndicator />
            Large
          </Radio>
        </FieldGroup>
      </RadioGroup>

      <RadioGroup>
        <Label>Size</Label>
        <FieldGroup className="gap-1">
          <Radio value="sm">
            <RadioIndicator />
            <FieldContent>
              <Label>Small</Label>
              <Description>Dimension: 128 x 128</Description>
            </FieldContent>
          </Radio>
          <Radio value="md">
            <RadioIndicator />
            <FieldContent>
              <Label>Medium</Label>
              <Description>Dimension: 256 x 256</Description>
            </FieldContent>
          </Radio>
          <Radio value="lg">
            <RadioIndicator />
            <FieldContent>
              <Label>Large</Label>
              <Description>Dimension: 512 x 512</Description>
            </FieldContent>
          </Radio>
        </FieldGroup>
        <Description>Please select a size.</Description>
      </RadioGroup>

      <RadioGroup>
        <Label>Size</Label>
        <FieldGroup className="*:rounded-md *:border *:selected:border-border-accent *:bg-card *:selected:bg-accent-muted *:p-4 *:transition-colors">
          <Radio value="sm">
            <RadioIndicator />
            <FieldContent>
              <Label>Small</Label>
              <Description>Dimension: 128 x 128</Description>
            </FieldContent>
          </Radio>
          <Radio value="md">
            <RadioIndicator />
            <FieldContent>
              <Label>Medium</Label>
              <Description>Dimension: 256 x 256</Description>
            </FieldContent>
          </Radio>
          <Radio value="lg">
            <RadioIndicator />
            <FieldContent>
              <Label>Large</Label>
              <Description>Dimension: 512 x 512</Description>
            </FieldContent>
          </Radio>
        </FieldGroup>
        <Description>Please select a size.</Description>
      </RadioGroup>
    </div>
  );
}
