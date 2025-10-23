import { Button } from "@dotui/registry/ui/button";

export function Announcement() {
  return (
    <Button
      href="/docs/changelog"
      className="h-7 rounded-full bg-neutral/50 text-xs text-fg-muted"
    >
      <span className="size-1.5 rounded-full bg-accent" />
      Introducing dotUI v1.0.0
    </Button>
  );
}
