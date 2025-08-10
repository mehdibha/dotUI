"use client";

import {
  ArrowRightIcon,
  CloudDownloadIcon,
  EyeIcon,
  LayoutGridIcon,
  ListIcon,
  SquareArrowOutUpRightIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { StyleProvider } from "@dotui/ui";
import { Button } from "@dotui/ui/components/button";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { TextField } from "@dotui/ui/components/text-field";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { BlocksShowcase } from "@dotui/ui/registry/blocks/showcase/blocks-showcase/components/blocks-showcase";
import type { RouterOutputs } from "@dotui/api";

import { useMounted } from "@/hooks/use-mounted";

export function StyleUIKit({
  style,
}: {
  style: RouterOutputs["style"]["getFeatured"][number];
}) {
  const { resolvedTheme } = useTheme();
  const isMounted = useMounted();

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <div className="max-w-xl space-y-2">
          <h2 className="font-heading text-3xl font-medium tracking-tight">
            {style.name}
          </h2>
          <p className="text-base text-balance text-fg-muted">
            Inspired by shadcn/ui. Flat, high-contrast look with minimum
            styling. Great starting point that's easy to customize and adapt to
            your design system.
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          suffix={<ArrowRightIcon />}
          href={`/styles/${style.user.username}/${style.name}`}
          className="w"
        >
          Explore style
        </Button>
      </div>
      <Skeleton show={!isMounted || !resolvedTheme}>
        <StyleProvider
          key={resolvedTheme}
          mode={resolvedTheme as "light" | "dark" | undefined}
          style={style}
          className="flex items-end justify-between gap-4 rounded-sm border p-6"
        >
          <BlocksShowcase />
        </StyleProvider>
      </Skeleton>
    </div>
  );
}
