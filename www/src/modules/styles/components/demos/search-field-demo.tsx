import React from "react";
import { SearchField } from "@/components/dynamic-core/search-field";

export function SearchFieldDemo() {
  return (
    <div className="flex flex-col gap-4">
      <SearchField placeholder="Search..." />
    </div>
  );
}
