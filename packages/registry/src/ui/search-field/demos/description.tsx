import { Description, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";

export default function Demo() {
  return (
    <SearchField>
      <Label>Search</Label>
      <Input />
      <Description>Enter your search query</Description>
    </SearchField>
  );
}
