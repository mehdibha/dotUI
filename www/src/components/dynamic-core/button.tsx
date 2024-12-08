"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import { ButtonProps } from "@/registry/core/button-01";
import { buttonStyles as buttonStyles01 } from "@/registry/core/button-01";

export const Button = createDynamicComponent<ButtonProps>("button", "Button", {
  "button-01": dynamic(
    () => import("@/__registry__/core/button-01").then((mod) => mod.Button),
    {
      loading: () => <Loader2Icon className="size-6 animate-spin" />,
      ssr: false,
    }
  ),
  "button-02": dynamic(
    () => import("@/__registry__/core/button-02").then((mod) => mod.Button),
    {
      loading: () => <Loader2Icon className="size-6 animate-spin" />,
      ssr: false,
    }
  ),
});

export const buttonStyles = buttonStyles01;
