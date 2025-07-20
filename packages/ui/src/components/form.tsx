"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { FormControl as _FormControl } from "../registry/components/form/react-hook-form";

export const FormControl = createDynamicComponent(
  "form",
  "FormControl",
  _FormControl,
  {
    basic: React.lazy(() =>
      import("../registry/components/form/react-hook-form").then((mod) => ({
        default: mod.FormControl,
      })),
    ),
  },
);
