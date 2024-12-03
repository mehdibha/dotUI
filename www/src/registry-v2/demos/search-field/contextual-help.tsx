import React from "react";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { SearchField } from "@/components/dynamic-core/search-field";

export default function Demo() {
  return (
    <SearchField
      label="Search"
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you need help, please contact support."
        />
      }
    />
  );
}
