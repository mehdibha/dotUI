import React from "react";
import { SearchField } from "@/registry/ui/default/core/search-field";

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SearchField label="Search" isRequired />
      <SearchField label="Search" isRequired necessityIndicator="icon" />
      <SearchField label="Search" isRequired necessityIndicator="label" />
      <SearchField label="Search" necessityIndicator="label" />
    </div>
  );
}
