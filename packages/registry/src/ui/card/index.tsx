"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  Card as _Card,
  CardAction as _CardAction,
  CardContent as _CardContent,
  CardDescription as _CardDescription,
  CardFooter as _CardFooter,
  CardHeader as _CardHeader,
  CardTitle as _CardTitle,
} from "./basic";

export const Card = createDynamicComponent<React.ComponentProps<"div">>(
  "card",
  "Card",
  _Card,
  {},
);

export const CardHeader = createDynamicComponent<React.ComponentProps<"div">>(
  "card",
  "CardHeader",
  _CardHeader,
  {},
);

export const CardTitle = createDynamicComponent<React.ComponentProps<"div">>(
  "card",
  "CardTitle",
  _CardTitle,
  {},
);

export const CardDescription = createDynamicComponent<
  React.ComponentProps<"div">
>("card", "CardDescription", _CardDescription, {});

export const CardContent = createDynamicComponent<React.ComponentProps<"div">>(
  "card",
  "CardContent",
  _CardContent,
  {},
);

export const CardFooter = createDynamicComponent<React.ComponentProps<"div">>(
  "card",
  "CardFooter",
  _CardFooter,
  {},
);

export const CardAction = createDynamicComponent<React.ComponentProps<"div">>(
  "card",
  "CardAction",
  _CardAction,
  {},
);
