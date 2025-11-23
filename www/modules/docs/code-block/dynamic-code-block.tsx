"use client";

import React, { Suspense, useDeferredValue, useId } from "react";
import { highlight } from "fumadocs-core/highlight";
import { useShiki } from "fumadocs-core/highlight/client";
import type {
  HighlightOptions,
  HighlightOptionsCommon,
  HighlightOptionsThemes,
} from "fumadocs-core/highlight";

import { Pre } from ".";

interface DynamicCodeBlockProps {
  code: string;
  lang?: string;
  options?: Omit<HighlightOptionsCommon, "lang"> & HighlightOptionsThemes;
  wrapInSuspense?: boolean;
  fallback?: React.ReactNode;
}

export function DynamicCodeBlock({
  code,
  lang = "tsx",
  options,
  wrapInSuspense = true,
  fallback,
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

  const fallbackNode = fallback ?? (
    <HighlightedFallback code={code} options={shikiOptions} />
  );

  return <Suspense fallback={fallbackNode}>{highlighted}</Suspense>;
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

function HighlightedFallback({
  code,
  options,
}: {
  code: string;
  options: HighlightOptions;
}) {
  const highlighted = React.useMemo(() => {
    try {
      return highlight(code, options);
    } catch {
      return null;
    }
  }, [code, options]);

  if (!highlighted) {
    return <Pre>{code}</Pre>;
  }

  return highlighted;
}
