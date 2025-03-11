import React from "react";
import { SearchField } from "@/components/dynamic-core/search-field";

export default function Demo() {
  return (
    <SearchField
      label="Search"
      isInvalid
      errorMessage="Please fill out this field."
    />
  );
}
