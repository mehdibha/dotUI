import { SearchField } from "@dotui/registry/ui/search-field";

export default function Demo() {
  return (
    <SearchField
      aria-label="Search"
      defaultValue="Is dotUI the next-gen ui lib?"
      isDisabled
    />
  );
}
