import { SearchField } from "@dotui/registry-v2/ui/search-field";

export function SearchFieldDemo() {
  return (
    <div className="flex flex-wrap gap-10 [&_[data-slot=search-field]]:w-full *:[div]:w-full *:[div]:max-w-sm">
      <div className="space-y-6">
        <SearchField label="Default" />
        <SearchField label="Disabled" isDisabled />
        <SearchField label="Required" isRequired />
        <SearchField label="Invalid" isInvalid />
      </div>
      <div className="space-y-4">
        <SearchField label="Read Only" isReadOnly />
        <SearchField
          label="With error message"
          isInvalid
          errorMessage="This is an error message"
        />
        <SearchField
          label="Description"
          description="This is a description for the TextField"
        />
      </div>
    </div>
  );
}
