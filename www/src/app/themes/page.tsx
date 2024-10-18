import React from "react";
import type { Metadata } from "next";
import { PlusIcon } from "lucide-react";
import { Button } from "@/registry/ui/default/core/button";
import { Preview } from "@/app/themes/preview";
import { PreviewProvider } from "./context";
import { CreateThemeDialog } from "./create-theme";
import { ExploreThemesDialog } from "./explore-themes";
import { ThemeCustomizer } from "./theme-customizer";

export const metadata: Metadata = {
  title: "Themes",
  description: "Explore and create themes for your project.",
};

export default function Page() {
  return (
    <PreviewProvider>
      <div className="container grid grid-cols-12 gap-10">
        <div className="col-span-6 py-16">
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
        <div className="sticky top-0 col-span-6 flex h-screen items-center justify-center">
          <Preview />
        </div>
      </div>
    </PreviewProvider>
  );
}
