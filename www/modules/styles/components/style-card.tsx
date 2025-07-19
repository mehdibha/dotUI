"use client";

import {
  CloudDownloadIcon,
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
import type { RouterOutputs } from "@dotui/api";

import { useMounted } from "@/hooks/use-mounted";

export function StyleCard(props: {
  style: RouterOutputs["style"]["all"][number];
}) {
  const { resolvedTheme } = useTheme();
  const isMounted = useMounted();

  return (
    <Skeleton show={!isMounted || !resolvedTheme}>
      <StyleProvider
        key={resolvedTheme}
        mode={resolvedTheme as "light" | "dark" | undefined}
        style={props.style}
        className="flex items-end justify-between gap-4 rounded-sm border p-6"
      >
        <div>
          <h2 className="font-heading text-2xl font-medium tracking-tight">
            {props.style.name}
          </h2>
          <p className="mt-0.5 text-sm text-fg-muted">
            {props.style.description}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button
              href={`/style/${props.style.slug}`}
              variant="accent"
              suffix={<SquareArrowOutUpRightIcon />}
              className="h-8 text-sm"
            >
              Explore style
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <TextField
            aria-label="Email"
            placeholder="Email"
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Button variant="default" prefix={<UserRoundPlusIcon />}>
              Invite
            </Button>
            <div className="flex items-center">
              <ToggleButton
                aria-label="List view"
                variant="accent"
                className="rounded-r-none border-r-0"
              >
                <ListIcon />
              </ToggleButton>
              <ToggleButton
                aria-label="Grid view"
                variant="accent"
                className="rounded-l-none"
              >
                <LayoutGridIcon />
              </ToggleButton>
            </div>
            <Button shape="square" aria-label="Sync">
              <CloudDownloadIcon />
            </Button>
          </div>
        </div>
      </StyleProvider>
    </Skeleton>
  );
}
