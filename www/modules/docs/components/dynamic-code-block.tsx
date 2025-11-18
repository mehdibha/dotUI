"use client";

import React, { Suspense, useDeferredValue, useId } from "react";
import { useShiki } from "fumadocs-core/highlight/client";
import type {
  HighlightOptions,
  HighlightOptionsCommon,
  HighlightOptionsThemes,
} from "fumadocs-core/highlight";

import { Pre } from "./code-block";

interface DynamicCodeBlockProps {
  code: string;
  lang?: string;
  options?: Omit<HighlightOptionsCommon, "lang"> & HighlightOptionsThemes;
  wrapInSuspense?: boolean;
}

export function DynamicCodeBlock({
  code,
  lang = "tsx",
  options,
  wrapInSuspense = true,
}: DynamicCodeBlockProps) {
  const id = useId();
  const deferredCode = useDeferredValue(code);

  const shikiOptions = React.useMemo<HighlightOptions>(
    () => ({
      lang,
      ...options,
      components: {
        pre: Pre,
        ...options?.components,
      },
    }),
    [lang, options],
  );

  const highlighted = (
    <Internal id={id} code={deferredCode} options={shikiOptions} />
  );

  if (!wrapInSuspense) {
    return highlighted;
  }

  return <Suspense fallback={<Pre>{code}</Pre>}>{highlighted}</Suspense>;
}

function Internal({
  id,
  code,
  options,
}: {
  id: string;
  code: string;
  options: HighlightOptions;
}) {
  return useShiki(code, options, [id, options.lang, code]);
}
