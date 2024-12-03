import React from "react";
import { SearchField } from "@/components/dynamic-core/search-field";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <SearchField isLoading loaderPosition="prefix" />
      <SearchField isLoading loaderPosition="suffix" />
    </div>
  );
}
