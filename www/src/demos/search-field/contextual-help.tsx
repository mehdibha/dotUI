import React from "react";
import { ContextualHelp } from "@/registry/ui/default/core/contextual-help";
import { SearchField } from "@/registry/ui/default/core/search-field";

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
