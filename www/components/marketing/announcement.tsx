import Link from "next/link";

import { Button } from "@dotui/registry/ui/button";

export function Announcement() {
  return (
    <Button
      asChild
      className="h-7 rounded-full bg-neutral/50 text-fg-muted text-xs"
    >
      <Link href="/docs/changelog">
        <span className="size-1.5 rounded-full bg-accent" />
        Introducing dotUI v1.0.0
      </Link>
    </Button>
  );
}
