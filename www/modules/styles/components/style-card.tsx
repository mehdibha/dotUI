"use client";

import React from "react";
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

export function StyleCard({
  style,
  variant = "ui-kit",
}: {
  style: RouterOutputs["style"]["getFeatured"][number];
  variant?: "ui-kit" | "card";
}) {
  const [isLoading, setLoading] = React.useState(true);
  const { resolvedTheme } = useTheme();
  const isMounted = useMounted();

  return (
    <div className="space-y-3">
      <div className="max-w-xl space-y-2">
        <div className="flex items-center gap-3">
          <Avatar
            src={style?.user?.image ?? ""}
            fallback={style?.user?.username?.slice(0, 2)}
            shape="square"
            className="mt-1 size-6"
          />
          <h2 className="font-heading text-xl font-medium leading-none tracking-tight lg:text-2xl">
            {style.name}
          </h2>
        </div>
        {style.description && (
          <p className="text-fg-muted text-balance text-base">
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
              className="text-fg-muted [&_svg]:text-fg gap-2 rounded-full"
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
            "relative flex max-h-[min(80svh,500px)] items-center justify-center overflow-hidden rounded-sm border duration-0",
            variant === "card" && "h-[250px] min-[550px]:max-md:h-[300px]",
          )}
        >
          <Link
            href={`/styles/${style.user.username}/${style.name}`}
            className={cn(
              focusRing(),
              "bg-bg/30 absolute inset-0 z-50 flex items-center justify-center opacity-0 duration-150 hover:opacity-100",
            )}
          >
            <span className="bg-primary text-fg-on-primary hover:bg-primary-hover active:bg-primary-active flex h-10 items-center justify-center rounded-md border px-4 text-base font-medium leading-normal tracking-tight duration-150">
              Open in editor
            </span>
          </Link>

          {variant === "card" && (
            <div
              className={cn(
                "flex size-full",
                isLoading && "bg-muted relative block animate-pulse rounded-md",
              )}
            >
              <iframe
                onLoad={() => setLoading(false)}
                src={`/view/${style.user.username}/${style.name}/blocks-showcase`}
                className={cn(
                  "scale-40 absolute -left-2 -top-2 h-[1200px] min-w-[1400px] origin-top-left min-[550px]:max-md:scale-50",
                  isLoading && "opacity-0",
                )}
              />
            </div>
          )}
          {variant === "ui-kit" && (
            <div inert className="w-[1600px] scale-90">
              <BlocksShowcase />
            </div>
          )}
        </StyleProvider>
      </Skeleton>
    </div>
  );
}
