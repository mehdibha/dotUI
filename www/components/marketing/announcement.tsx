import { Button } from "@dotui/registry/ui/button";

export function Announcement() {
  return (
    <Button
      href="/docs/changelog"
      className="h-7 rounded-full bg-neutral/50 text-xs text-fg-muted"
    >
      Introducing a dynamic shadcn registry
    </Button>
  );
}
