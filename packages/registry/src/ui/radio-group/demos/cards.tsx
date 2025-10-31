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

export default function Demo() {
  return (
    <RadioGroup defaultValue="sm" orientation="horizontal">
      <Label>Size</Label>
      <FieldGroup>
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
    </RadioGroup>
  );
}
