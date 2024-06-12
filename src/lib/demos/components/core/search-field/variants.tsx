import { SearchField } from "@/lib/components/core/default/search-field";

export default function Demo() {
  return (
    <div className="space-y-4">
      <SearchField variant="success" label="Success" />
      <SearchField variant="warning" label="Warning" />
      <SearchField variant="danger" label="Danger" />
    </div>
  );
}
