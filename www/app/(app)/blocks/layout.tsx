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
    <div className="container max-w-screen-2xl p-14">
      <h2 className="text-4xl font-semibold tracking-tighter text-balance">
        Blocks that don’t lock you in.
      </h2>
      <p className="mt-2 text-base text-fg-muted">
        Modern UI blocks available in infinite styles.
      </p>
      <div className="sticky top-0 z-30 flex items-center gap-2 bg-bg h-18">
        <Button variant="primary">Add your block</Button>
        <StyleSelector buttonProps={{ className: "px-4" }} />
      </div>
      <BlocksNav className="mt-0">{children}</BlocksNav>
    </div>
  );
}
