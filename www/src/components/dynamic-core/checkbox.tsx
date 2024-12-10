"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type { CheckboxProps } from "@/registry/core/checkbox-01";

export const Checkbox = createDynamicComponent<CheckboxProps>(
  "checkbox",
  "Checkbox",
  {
    "checkbox-01": dynamic(
      () =>
        import("@/__registry__/core/checkbox-01").then((mod) => mod.Checkbox),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
