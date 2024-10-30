import React from "react";
import type { Metadata } from "next";
import { PlusIcon } from "lucide-react";
import { Button } from "@/registry/ui/default/core/button";
import { PreviewProvider } from "./components/context";
import { CreateThemeDialog } from "./components/create-theme";
import { ExploreThemesDialog } from "./components/explore-themes";
import { Preview } from "./components/preview";
import { ThemeCustomizer } from "./components/theme-customizer";

export const metadata: Metadata = {
  title: "Themes",
  description: "Explore and create themes for your project.",
};

export default function Page() {
  return (
    <PreviewProvider>
      <div className="container">
        <div className="relative grid grid-cols-12 items-start gap-10 py-16">
          <div className="col-span-12 lg:col-span-5">
            <h1 className="font-heading xs:text-2xl text-pretty text-xl font-semibold tracking-tighter sm:text-3xl md:text-4xl">
              Everything starts with identity.
            </h1>
            <h2 className="text-fg-muted mt-3 text-sm">
              Generate colors, fonts, and spacing to match your brand identity.
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <ExploreThemesDialog>
                <Button variant="primary">Explore themes</Button>
              </ExploreThemesDialog>
              <CreateThemeDialog>
                <Button variant="outline" prefix={<PlusIcon />}>
                  Create theme
                </Button>
              </CreateThemeDialog>
            </div>
            <ThemeCustomizer className="mt-16" />
          </div>
          <div className="sticky top-10 hidden h-[calc(100svh-theme(spacing.20))] justify-center lg:col-span-7 lg:flex">
            <div className="bg-bg h-full w-full overflow-hidden rounded border">
              <Preview />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-bg-muted h-[700px] rounded-lg"></div>
          <div className="bg-bg-muted h-[700px] rounded-lg"></div>
        </div>
      </div>
    </PreviewProvider>
  );
}
