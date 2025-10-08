import { NumberField } from "@dotui/registry-v2/ui/number-field";

export function NumberFieldDemo() {
  return (
    <div className="flex flex-wrap gap-10">
      <div className="space-y-6">
        <NumberField label="Default" />
        <NumberField label="Disabled" isDisabled />
        <NumberField label="Required" isRequired />
        <NumberField label="Read Only" isReadOnly />
      </div>
      <div className="space-y-6">
        <NumberField label="Invalid" isInvalid />
        <NumberField
          label="With error message"
          isInvalid
          errorMessage="This is an error message"
        />
        <NumberField
          label="Description"
          description="This is a description for the NumberField"
        />
      </div>
    </div>
  );
}
