"use client";

import { ListBox } from "@/components/dynamic-ui/list-box";

export default function Demo() {
  return (
    <ListBox
      aria-label="Search results"
      renderEmptyState={() => "No results found."}
    >
      {[]}
    </ListBox>
  );
}
