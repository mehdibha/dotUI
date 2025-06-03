"use client";

import type { Selection } from "react-aria-components";
import React from "react";
import { ListBox, ListBoxItem } from "@/components/dynamic-ui/list-box";

export default function Demo() {
  const [selected, setSelected] = React.useState<Selection>(
    new Set(["nextjs", "remix", "astro"])
  );
  return (
    <div className="flex flex-col items-center gap-6">
      <ListBox
        aria-label="Framework"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <ListBoxItem id="nextjs">Next.js</ListBoxItem>
        <ListBoxItem id="remix">Remix</ListBoxItem>
        <ListBoxItem id="astro">Astro</ListBoxItem>
        <ListBoxItem id="gatsby">Gatsby</ListBoxItem>
      </ListBox>
      <p className="text-fg-muted text-sm">
        Selected items:{" "}
        <span className="font-semibold">
          {selected === "all" ? "all" : Array.from(selected).join(", ")}
        </span>
      </p>
    </div>
  );
}
