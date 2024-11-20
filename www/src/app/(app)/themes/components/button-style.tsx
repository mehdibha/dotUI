import { Radio, RadioGroup } from "@/registry/ui/default/core/radio-group";

const variants = [
  { label: "Variant 1", value: "button-01" },
  { label: "variant 2", value: "button-02" },
];

export function ButtonStyle() {
  return (
    <div>
      <RadioGroup variant="card" orientation="vertical">
        {variants.map((variant) => (
          <Radio key={variant.value} value={variant.value}>
            {variant.label}
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
