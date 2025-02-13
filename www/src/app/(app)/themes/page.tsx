"use client";

import { Link } from "next-view-transitions";
import { useMounted } from "@/hooks/use-mounted";
import { Skeleton } from "@/registry/core/skeleton_basic";
import { themes } from "@/registry/registry-themes";
import { ThemeProvider } from "@/modules/themes/components/theme-provider";

export default function Page() {
  const isMounted = useMounted();
  return (
    <div className="pt-16">
      <h2 className="w-fit text-2xl font-semibold [view-transition-name:themes-title]">
        Themes
      </h2>
      <div className="group mt-10 grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <Link key={theme.name} href="/themes/theme">
            <Skeleton show={!isMounted}>
              <ThemeProvider
                theme={theme}
                className="overflow-hidden rounded-md border transition-opacity hover:!opacity-100 group-hover:opacity-50"
              >
                <div className="p-2">
                  <p
                    className="font-heading w-fit text-lg font-semibold"
                    style={{ viewTransitionName: theme.name }}
                  >
                    {theme.label}
                  </p>
                  <ul className="text-fg-muted list-none text-sm">
                    <li className="flex items-center gap-1 [&_svg]:size-4">
                      {theme.foundations.dark && theme.foundations.light ? (
                        <span>Light and dark mode.</span>
                      ) : (
                        <span>
                          {theme.foundations.dark ? "Dark" : "Light"} mode only.
                        </span>
                      )}
                    </li>
                  </ul>
                </div>
                <div className="mt-2 grid grid-cols-10">
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
                <div className="grid grid-cols-10">
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
              </ThemeProvider>
            </Skeleton>
          </Link>
        ))}
      </div>
    </div>
  );
}
