"use client";

import type * as React from "react";

import { useIsMobile } from "@/hooks/use-mobile";

export interface ResponsiveProps {
  /**
   * Renders the content for the current viewport; `isMobile` is `true` below
   * the mobile breakpoint.
   */
  render: (isMobile: boolean) => React.ReactNode;
}

/**
 * Headless helper that renders different content depending on the viewport.
 *
 * ```tsx
 * <Responsive
 *   render={(isMobile) => (isMobile ? <Sheet>…</Sheet> : <Modal>…</Modal>)}
 * />
 * ```
 */
export function Responsive({ render }: ResponsiveProps) {
  const isMobile = useIsMobile();
  return <>{render(isMobile)}</>;
}
