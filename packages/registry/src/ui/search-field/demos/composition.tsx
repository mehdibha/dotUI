import { SearchIcon } from "@dotui/registry/icons";
import { Description, Label } from "@dotui/registry/ui/field";
import { Input, InputRoot } from "@dotui/registry/ui/input";
import { SearchFieldRoot } from "@dotui/registry/ui/search-field";

export default function Demo() {
  return (
    <SearchFieldRoot>
      <Label>Search</Label>
      <InputRoot prefix={<SearchIcon />}>
        <Input />
      </InputRoot>
      <Description>Enter your search query.</Description>
    </SearchFieldRoot>
  );
}
