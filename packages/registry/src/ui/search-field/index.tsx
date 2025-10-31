"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { SearchFieldProps } from "./basic";
import { SearchField as _SearchField } from "./basic";

export const SearchField = createDynamicComponent(
  "search-field",
  "SearchField",
  _SearchField,
  {},
);

export type { SearchFieldProps };
