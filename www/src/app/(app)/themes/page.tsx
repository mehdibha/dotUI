"use client";

import { ListFilterIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/core/button";
import { SearchField } from "@/components/core/search-field";
import { Skeleton } from "@/registry/core/skeleton_basic";
import { themes } from "@/registry/registry-themes";
import { ThemeProvider } from "@/modules/themes/components/theme-provider";

export default function Page() {
  const isMounted = useMounted();
  return (
    <div className="container max-w-3xl pb-36 pt-16">
      <h2 className="w-fit text-2xl font-semibold [view-transition-name:themes-title]">
        Themes
      </h2>
      <p className="text-fg-muted mt-2 text-base">
        A theme provide a complete design system with carefully crafted colors,
        typography, and chosen components.
      </p>
      <div className="mt-6 flex items-center gap-2">
        <SearchField placeholder="Search themes..." className="flex-1" />
        <Button prefix={<ListFilterIcon />}>Filter</Button>
        <Button variant="primary" className="">
          Create theme
        </Button>
      </div>
      <h3 className="mt-6 text-lg font-semibold">Your themes</h3>
      <p className="text-fg-muted mt-1">No themes created yet!</p>
      <h3 className="mt-6 text-lg font-semibold">Featured themes</h3>
      <div className="group mt-4 grid grid-cols-2 gap-x-2 gap-y-4">
        {themes.map((theme) => (
          <div
            key={theme.name}
            className="group/theme-card flex flex-col gap-1 transition-opacity hover:!opacity-100 group-hover:opacity-80"
          >
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
                      <span className="block text-lg font-semibold">
                        {theme.label}
                      </span>
                      <span className="text-fg-muted block text-sm">
                        {theme.foundations.dark && theme.foundations.light ? (
                          <span>Light and dark mode.</span>
                        ) : (
                          <span>
                            {theme.foundations.dark ? "Dark" : "Light"} mode
                            only.
                          </span>
                        )}
                      </span>
                    </div>
                    {/* <RadioIndicator /> */}
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
          </div>
        ))}
      </div>
    </div>
  );
}
