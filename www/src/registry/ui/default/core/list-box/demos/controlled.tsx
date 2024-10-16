"use client";

import React from "react";
import type { Selection } from "react-aria-components";
import { ListBox, Item } from "@/registry/ui/default/core/list-box";

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
        <Item id="nextjs">Next.js</Item>
        <Item id="remix">Remix</Item>
        <Item id="astro">Astro</Item>
        <Item id="gatsby">Gatsby</Item>
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
