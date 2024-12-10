"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type { BadgeProps } from "@/registry/core/badge-01";

export const Badge = createDynamicComponent<BadgeProps>("badge", "Badge", {
  "badge-01": dynamic(
    () => import("@/__registry__/core/badge-01").then((mod) => mod.Badge),
    {
      loading: () => <Loader2Icon className="size-6 animate-spin" />,
      ssr: false,
    }
  ),
});
