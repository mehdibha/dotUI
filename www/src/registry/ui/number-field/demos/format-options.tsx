import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <NumberField
        defaultValue={0}
        formatOptions={{
          signDisplay: "exceptZero",
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        }}
      >
        <Label>Decimal</Label>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>

      <NumberField
        defaultValue={0.05}
        formatOptions={{
          style: "percent",
        }}
      >
        <Label>Percentage</Label>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>

      <NumberField
        defaultValue={45}
        formatOptions={{
          style: "currency",
          currency: "EUR",
          currencyDisplay: "code",
          currencySign: "accounting",
        }}
      >
        <Label>Currency</Label>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>

      <NumberField
        defaultValue={4}
        formatOptions={{
          style: "unit",
          unit: "inch",
          unitDisplay: "long",
        }}
      >
        <Label>Unit</Label>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <Input />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}
