"use client";

import React from "react";
import Link from "next/link";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/registry/core/skeleton_basic";
import { ThemeProvider } from "@/modules/themes/components/theme-provider";
import { type Theme } from "@/modules/themes/types";

export function ThemeCard({ theme }: { theme: Theme }) {
  const isMounted = useMounted();

  return (
    <Skeleton show={!isMounted}>
      <ThemeProvider
        key={theme.name}
        theme={theme}
        unstyled
        className="text-fg"
      >
        <Link
          href={`/themes/${theme.name}`}
          className="bg-bg flex flex-col items-start justify-start gap-0 overflow-hidden rounded-md border p-0"
        >
          <div className="flex w-full items-start justify-between p-2">
            <div>
              <span className="block text-lg font-semibold">{theme.label}</span>
              <span className="text-fg-muted block text-sm">
                {theme.foundations.dark && theme.foundations.light ? (
                  <span>Light and dark mode.</span>
                ) : (
                  <span>
                    {theme.foundations.dark ? "Dark" : "Light"} mode only.
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="grid w-full grid-cols-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: `var(--neutral-${(i + 1) * 100})`,
                }}
                className="h-4"
              ></div>
            ))}
          </div>
          <div className="grid w-full grid-cols-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: `var(--accent-${(i + 1) * 100})`,
                }}
                className="h-4"
              ></div>
            ))}
          </div>
        </Link>
      </ThemeProvider>
    </Skeleton>
  );
}
