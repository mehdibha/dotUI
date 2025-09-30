import { SearchField } from "@dotui/registry/ui/search-field";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <SearchField aria-label="small (sm)" placeholder="small (sm)" size="sm" />
      <SearchField
        aria-label="medium (md)"
        placeholder="medium (md)"
        size="md"
      />
      <SearchField aria-label="large (lg)" placeholder="large (lg)" size="lg" />
    </div>
  );
}
