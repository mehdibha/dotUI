"use client";

import Link from "next/link";
import { useTheme } from "next-themes";

import { StyleProvider } from "@dotui/ui";
import { Avatar } from "@dotui/ui/components/avatar";
import { Badge } from "@dotui/ui/components/badge";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { AdobeIcon, TailwindIcon } from "@dotui/ui/icons";
import { focusRing } from "@dotui/ui/lib/focus-styles";
import { cn } from "@dotui/ui/lib/utils";
import { BlocksShowcase } from "@dotui/ui/registry/blocks/showcase/blocks-showcase/components/blocks-showcase";
import type { RouterOutputs } from "@dotui/api";

import { useMounted } from "@/hooks/use-mounted";

export function StyleUIKit({
  style,
  variant = "ui-kit",
}: {
  style: RouterOutputs["style"]["getFeatured"][number];
  variant?: "ui-kit" | "card";
}) {
  const { resolvedTheme } = useTheme();
  const isMounted = useMounted();

  return (
    <div className="space-y-5">
      <div className="max-w-xl space-y-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={style?.user?.image ?? ""}
            fallback={style?.user?.username?.slice(0, 2)}
            shape="square"
            className="mt-1 size-6"
          />
          <h2 className="font-heading text-3xl leading-none font-medium tracking-tight">
            {style.name}
          </h2>
        </div>
        {style.description && (
          <p className="text-base text-balance text-fg-muted">
            {style.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {[
            {
              label: "tailwindcss",
              icon: <TailwindIcon />,
            },
            {
              label: "react-aria-components",
              icon: <AdobeIcon fill="#E1251B" />,
            },
          ].map((item) => (
            <Badge
              key={item.label}
              className="gap-2 rounded-full text-fg-muted [&_svg]:text-fg"
            >
              {item.icon}
              {item.label}
            </Badge>
          ))}
        </div>
      </div>
      <Skeleton show={!isMounted || !resolvedTheme}>
        <StyleProvider
          key={resolvedTheme}
          mode={resolvedTheme as "light" | "dark" | undefined}
          style={style}
          className={cn(
            "relative flex max-h-[min(80svh,500px)] items-center justify-center rounded-sm border",
            // Keep overflow-hidden always, as requested explicitly for card
            "overflow-hidden",
          )}
        >
          <Link
            href={`/styles/${style.user.username}/${style.name}`}
            className={cn(
              focusRing(),
              "absolute inset-0 z-50 flex items-center justify-center bg-bg-muted/50 opacity-0 duration-150 hover:opacity-100",
            )}
          >
            <span className="flex h-10 items-center justify-center rounded-md border bg-bg-primary px-4 text-base leading-normal font-medium tracking-tight text-fg-on-primary duration-150 hover:bg-bg-primary-hover active:bg-bg-primary-active">
              Explore style
            </span>
          </Link>
          <div inert className={cn(variant === "card" && "scale-80")}> 
            <BlocksShowcase />
          </div>
        </StyleProvider>
      </Skeleton>
    </div>
  );
}
