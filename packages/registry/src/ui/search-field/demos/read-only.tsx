import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";

export default function Demo() {
  return (
    <SearchField isReadOnly defaultValue="Marvel movies">
      <Label>Search</Label>
      <Input />
    </SearchField>
  );
}
