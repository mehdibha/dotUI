import { SearchField } from "@/registry/ui/default/core/search-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <SearchField label="Search" placeholder="Visible label" />
      <SearchField aria-label="Search" placeholder="Hidden label" />
    </div>
  );
}
