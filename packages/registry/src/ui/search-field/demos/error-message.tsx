import { FieldError, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";

export default function Demo() {
  return (
    <SearchField isInvalid>
      <Label>Search</Label>
      <Input />
      <FieldError>Please fill out this field.</FieldError>
    </SearchField>
  );
}
