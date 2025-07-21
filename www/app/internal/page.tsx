import { MenuIcon } from "lucide-react";

import { StyleProvider } from "@dotui/ui";
import { Button } from "@dotui/ui/components/button";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";

import { caller } from "@/lib/trpc/server";

export default async function InternalPage() {
  const style = await caller.style.bySlug({ slug: "minimalist" });

  return (
    <div className="flex items-center justify-center p-10">
      <div className="light">
        <div className="bg-bg text-fg">hello world</div>
      </div>
    </div>
  );
}
