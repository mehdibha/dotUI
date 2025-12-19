"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type { SearchFieldProps } from "./types";

export const SearchField = createDynamicComponent("search-field", "SearchField", Default.SearchField, {});

export type { SearchFieldProps };
