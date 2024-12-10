"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type {
  ComboboxProps,
  ComboboxRootProps,
} from "@/registry/core/combobox-01";

export const Combobox = createDynamicComponent<ComboboxProps<object>>(
  "combobox",
  "Combobox",
  {
    "combobox-01": dynamic(
      () =>
        import("@/__registry__/core/combobox-01").then((mod) => mod.Combobox),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);

export const ComboboxRoot = createDynamicComponent<ComboboxRootProps<object>>(
  "combobox",
  "ComboboxRoot",
  {
    "combobox-01": dynamic(
      () =>
        import("@/__registry__/core/combobox-01").then(
          (mod) => mod.ComboboxRoot
        ),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
