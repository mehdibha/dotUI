"use client";

import React from "react";
import Link from "next/link";

import { focusRing } from "@dotui/registry/lib/focus-styles";
import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import type { RouterOutputs } from "@dotui/api";

export function StyleCard({
  style,
}: {
  style: RouterOutputs["style"]["getPublicStyles"][number];
}) {
  const [isLoading, setLoading] = React.useState(true);

  return (
    <div className="@container/style-card space-y-3">
      <div className="@2xl/style-card:h-[300px] relative flex h-[250px] max-h-[min(80svh,500px)] items-center justify-center overflow-hidden rounded-sm border duration-0 min-[550px]:max-md:h-[300px]">
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
        <div
          className={cn(
            "flex size-full",
            isLoading && "bg-muted relative block animate-pulse rounded-md",
          )}
        >
          <iframe
            onLoad={() => setLoading(false)}
            src={`/view/${style.user.username}/${style.name}/cards?view=true`}
            className={cn(
              "scale-30 @sm/style-card:scale-35 @md/style-card:scale-40 @lg/style-card:scale-45 @xl/style-card:scale-50 @2xl/style-card:scale-60 absolute h-[1200px] min-w-[1400px] origin-top-left",
              isLoading && "opacity-0",
            )}
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 px-[2px]">
        <h2 className="font-heading text-xl font-medium leading-none tracking-tight">
          {style.name}
        </h2>
        <div className="flex items-center gap-2">
          <Avatar
            src={style.user.image ?? ""}
            fallback={style.user.username.slice(0, 2)}
            shape="square"
            className="mt-1 size-5"
          />
          <p>{style.user.username}</p>
        </div>
      </div>
    </div>
  );
}
