import React from "react";
import type { Metadata } from "next";
import { PlusIcon } from "lucide-react";
import { Button } from "@/registry/ui/default/core/button";
import { ButtonsCustomizer } from "./buttons";
import { PreviewProvider } from "./components/context";
import { CreateThemeDialog } from "./components/create-theme";
import { ExploreThemesDialog } from "./components/explore-themes";
import { Foundations } from "./components/foundations";
import { Preview } from "./components/preview";

export const metadata: Metadata = {
  title: "Themes",
  description: "Explore and create themes for your project.",
};

export default function Page() {
  return (
    <PreviewProvider>
      <div className="container">
        <div className="relative grid grid-cols-12 items-start gap-10 py-10">
          <div className="col-span-12 mt-6 lg:col-span-5">
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
            <Foundations className="mt-16" />
          </div>
          <div className="sticky top-10 hidden h-[calc(100svh-theme(spacing.20))] justify-center lg:col-span-7 lg:flex">
            <Preview />
          </div>
        </div>
      </div>
    </PreviewProvider>
  );
}