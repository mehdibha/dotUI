"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  Avatar as _Avatar,
  AvatarFallback as _AvatarFallback,
  AvatarImage as _AvatarImage,
  AvatarPlaceholder as _AvatarPlaceholder,
  AvatarRoot as _AvatarRoot,
} from "./basic";
import type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarPlaceholderProps,
  AvatarProps,
  AvatarRootProps,
} from "./basic";

export const Avatar = createDynamicComponent<AvatarProps>(
  "avatar",
  "Avatar",
  _Avatar,
  {},
);

export const AvatarRoot = createDynamicComponent<AvatarRootProps>(
  "avatar",
  "AvatarRoot",
  _AvatarRoot,
  {},
);

export const AvatarImage = createDynamicComponent<AvatarImageProps>(
  "avatar",
  "AvatarImage",
  _AvatarImage,
  {},
);

export const AvatarFallback = createDynamicComponent<AvatarFallbackProps>(
  "avatar",
  "AvatarFallback",
  _AvatarFallback,
  {},
);

export const AvatarPlaceholder = createDynamicComponent<AvatarPlaceholderProps>(
  "avatar",
  "AvatarPlaceholder",
  _AvatarPlaceholder,
  {},
);

export type {
  AvatarProps,
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarPlaceholderProps,
};
