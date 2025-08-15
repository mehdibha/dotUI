import type { MDXComponents } from "mdx/types";

import { mdxComponents } from "@/modules/docs/components/mdx-components";

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
