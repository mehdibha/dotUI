"use client";

import { useQuery } from "@tanstack/react-query";

import { cn } from "@dotui/ui/lib/utils";

import { useMounted } from "@/hooks/use-mounted";
import { useTRPC } from "@/trpc/react";
import { StyleCard } from "./style-card";

export function StylesList(props: React.ComponentProps<"div">) {
  const isMounted = useMounted();
  const trpc = useTRPC();
  const { data: styles, isSuccess } = useQuery({
    ...trpc.style.all.queryOptions({
      isFeatured: true,
    }),
    enabled: isMounted,
  });

  if (!isMounted || !isSuccess) {
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
