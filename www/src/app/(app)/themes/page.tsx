import React from "react";
import type { Metadata } from "next";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Alert } from "@/components/core/alert";
import { Button } from "@/components/core/button";
import { Borders } from "./components/borders";
import { ButtonStyle } from "./components/button-style";
import { Colors } from "./components/colors";
import { PreviewProvider } from "./components/context";
import { CreateThemeDialog } from "./components/create-theme";
import { ExploreThemesDialog } from "./components/explore-themes";
import { Iconography } from "./components/iconography";
import { Preview } from "./components/preview";
import { ThemeSelect } from "./components/theme-select";
import { Typography } from "./components/typography";

export const metadata: Metadata = {
  title: "Themes",
  description: "Explore and create themes for your project.",
};

export default function Page() {
  return (
    <PreviewProvider>
      <div className="container space-y-6 pb-20">
        <div className="relative grid grid-cols-12 items-start gap-6 pt-10">
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
            <ThemeSelect className="mt-10" />
            <div className="mt-6 space-y-6">
              <Section title="Colors">
                <Colors />
              </Section>
              <Section title="Typography">
                <Typography />
              </Section>
              <Section title="Borders">
                <Borders />
              </Section>
              <Section title="Iconography">
                <Iconography />
              </Section>
            </div>
          </div>
          <div className="sticky top-10 hidden h-[calc(100svh-calc(var(--spacing)*20))] justify-center lg:col-span-7 lg:flex">
            <Preview />
          </div>
        </div>
        <Section title="Button style" className="col-span-6">
          <ButtonStyle />
        </Section>
      </div>
    </PreviewProvider>
  );
}

const Section = ({
  title,
  children,
  className,
}: {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("bg-bg-muted/40 rounded-md border p-4", className)}>
      {title && (
        <h3 className="font-heading mb-4 text-lg font-semibold tracking-tighter">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
