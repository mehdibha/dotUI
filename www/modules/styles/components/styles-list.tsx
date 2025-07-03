"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@dotui/ui/lib/utils";

import { useTRPC } from "@/trpc/react";
import { StyleCard } from "./style-card";

export function StylesList(props: React.ComponentProps<"div">) {
  const trpc = useTRPC();
  const { data: styles, isSuccess } = useQuery({
    ...trpc.style.all.queryOptions({
      isFeatured: true,
    }),
  });

  if (!styles) {
    return <div className="text-fg-muted">No styles found...</div>;
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4", props.className)}>
      {styles?.map((style) => (
        <StyleCard key={style.name} style={style} />
      ))}
    </div>
  );
}
