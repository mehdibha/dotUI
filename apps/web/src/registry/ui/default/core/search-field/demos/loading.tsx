import React from "react";
import { SearchField } from "@/registry/ui/default/core/search-field";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <SearchField isLoading loaderPosition="prefix" />
      <SearchField isLoading loaderPosition="suffix" />
    </div>
  );
}
