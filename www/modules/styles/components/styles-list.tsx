"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { cn } from "@dotui/ui/lib/utils";

import { useTRPC } from "@/trpc/react";
import { StyleCard } from "./style-card";

export function StylesList(props: React.ComponentProps<"div">) {
  const trpc = useTRPC();
  const { data: styles, isSuccess } = useSuspenseQuery(
    trpc.style.all.queryOptions({
      isFeatured: true,
    }),
  );

  if (!isSuccess) {
    return (
      <div className="relative flex w-full flex-col gap-4">loading...</div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4", props.className)}>
      {styles.map((style) => (
        <StyleCard key={style.name} style={style} />
      ))}
    </div>
  );
}
