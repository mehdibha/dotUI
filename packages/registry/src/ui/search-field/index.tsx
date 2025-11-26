"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { SearchField as _SearchField } from "./basic";
import type { SearchFieldProps } from "./types";

export const SearchField = createDynamicComponent(
  "search-field",
  "SearchField",
  _SearchField,
  {},
);

export type { SearchFieldProps };
