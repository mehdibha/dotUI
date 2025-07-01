import { Button } from "@dotui/ui/components/button";

import { StyleSelector } from "@/modules/styles/components/style-selector";
import { StylesList } from "@/modules/styles/components/styles-list";
import { prefetch, trpc } from "@/trpc/server";

export default function StylesPage() {
  prefetch(
    trpc.style.all.queryOptions({
      isFeatured: true,
    }),
  );
  return (
    <div className="p-10">
      <h2 className="w-fit text-3xl font-semibold tracking-tight">
        Find your style or make your own.
      </h2>
      <p className="mt-2 text-base text-fg-muted">
        Choose a style to get started or create your own.
      </p>
      <div className="mt-6 flex items-center gap-2">
        <Button variant="primary">Create style</Button>
        <Button>Browse styles</Button>
      </div>
      <h2 className="mt-16 text-2xl font-semibold tracking-tight">
        Featured styles
      </h2>
      <StylesList className="mt-6" />
    </div>
  );
}
