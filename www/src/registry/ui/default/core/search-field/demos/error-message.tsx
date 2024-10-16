import React from "react";
import { SearchField } from "@/registry/ui/default/core/search-field";

export default function Demo() {
  return (
    <SearchField
      label="Search"
      isInvalid
      errorMessage="Please fill out this field."
    />
  );
}
