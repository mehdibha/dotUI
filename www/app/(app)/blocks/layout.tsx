"use client";

import { Button } from "@dotui/ui/components/button";

import { BlocksNav } from "@/modules/blocks/components/blocks-nav";
import { StyleSelector } from "@/modules/styles/components/style-selector";

export default function BlocksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-14">
      <div className="container max-w-screen-2xl px-14">
        <h2 className="text-balance text-4xl font-semibold tracking-tighter">
          Blocks that don’t lock you in.
        </h2>
        <p className="text-fg-muted mt-2 text-base">
          Modern UI blocks available in infinite styles.
        </p>
        <div className="h-18 flex items-center gap-2">
          <Button variant="primary">Add your block</Button>
          <StyleSelector buttonProps={{ className: "px-4" }} />
        </div>
      </div>
      <BlocksNav className="mt-4">{children}</BlocksNav>
    </div>
  );
}
