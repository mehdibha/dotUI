import React from "react";
import type { Metadata } from "next";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "next-view-transitions";
import { cn } from "@/lib/utils";
import { Borders } from "./components/borders";
import { ButtonStyle } from "./components/button-style";
import { Colors } from "./components/colors";
import { FocusStyle } from "./components/focus-style";
import { Iconography } from "./components/iconography";
import { InputStyle } from "./components/input-style";
import { ListBoxStyle } from "./components/listbox-style";
import { LoaderStyle } from "./components/loader-style";
import { OverlayStyle } from "./components/overlay-style";
import { PickerStyle } from "./components/picker-style";
import { TabsStyle } from "./components/tabs-style";
import { ThemeSelect } from "./components/theme-select";
import { Typography } from "./components/typography";

export const metadata: Metadata = {
  title: "Themes",
  description: "Explore and create themes for your project.",
};

export default function Page() {
  return (
    <div className="pb-20">
      {/* <section className="pb-10 pt-16">
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
            <Button
              variant="outline"
              className="bg-bg-inverse/5"
              prefix={<PlusIcon />}
            >
              Create theme
            </Button>
          </CreateThemeDialog>
        </div>
      </section> */}
      <section className="py-8">
        <Link
          href="/themes"
          className="text-fg-muted hover:text-fg mb-2 flex cursor-pointer items-center gap-1 text-sm"
        >
          <ArrowLeftIcon className="size-4" />
          <span>
            back to{" "}
            <span className="[view-transition-name:themes-title]">themes</span>
          </span>
        </Link>
        <ThemeSelect />
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
          <Section title="Loader style" className="col-span-6">
            <LoaderStyle />
          </Section>
          <Section title="Focus style" className="col-span-6">
            <FocusStyle />
          </Section>
          <Section title="Button style" className="col-span-6">
            <ButtonStyle />
          </Section>
          <Section title="Input style" className="col-span-6">
            <InputStyle />
          </Section>
          <Section title="Picker style" className="col-span-6">
            <PickerStyle />
          </Section>
          <Section title="Listbox style" className="col-span-6">
            <ListBoxStyle />
          </Section>
          <Section title="Modal/Popover/Tooltip style" className="col-span-6">
            <OverlayStyle />
          </Section>
          <Section title="Tabs style" className="col-span-6">
            <TabsStyle />
          </Section>
        </div>
      </section>
    </div>
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
