"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type {
  AvatarProps,
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
} from "@/registry/core/avatar-01";

export const Avatar = createDynamicComponent<AvatarProps>("avatar", "Avatar", {
  "avatar-01": dynamic(
    () => import("@/__registry__/core/avatar-01").then((mod) => mod.Avatar),
    {
      loading: () => <Loader2Icon className="size-6 animate-spin" />,
      ssr: false,
    }
  ),
});

export const AvatarRoot = createDynamicComponent<AvatarRootProps>(
  "avatar",
  "AvatarRoot",
  {
    "avatar-01": dynamic(
      () => import("@/__registry__/core/avatar-01").then((mod) => mod.Avatar),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);

export const AvatarImage = createDynamicComponent<AvatarImageProps>(
  "avatar",
  "AvatarImage",
  {
    "avatar-01": dynamic(
      () => import("@/__registry__/core/avatar-01").then((mod) => mod.Avatar),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);

export const AvatarFallback = createDynamicComponent<AvatarFallbackProps>(
  "avatar",
  "AvatarFallback",
  {
    "avatar-01": dynamic(
      () => import("@/__registry__/core/avatar-01").then((mod) => mod.Avatar),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
