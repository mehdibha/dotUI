"use client";

import React from "react";
import {
  LockIcon,
  Maximize2Icon,
  Minimize2Icon,
  MonitorIcon,
  MoonIcon,
  RotateCwIcon,
  SmartphoneIcon,
  SunIcon,
  TabletIcon,
} from "lucide-react";
import { Modal as AriaModal, Dialog as AriaDialog } from "react-aria-components";
import Balancer from "react-wrap-balancer";
import { useConfig } from "@/hooks/use-config";
import { Button } from "@/lib/components/core/default/button";
import { Dialog, DialogRoot } from "@/lib/components/core/default/dialog";
import { Drawer, DrawerRoot } from "@/lib/components/core/default/drawer";
import { ScrollArea } from "@/lib/components/core/default/scroll-area";
import { TextField } from "@/lib/components/core/default/text-field";
import {
  ToggleGroup,
  ToggleGroupButton,
} from "@/lib/components/core/default/toggle-group";
import { Tooltip } from "@/lib/components/core/default/tooltip";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils/classes";

export default function ThemesPage() {
  const { mode, setMode } = useConfig();
  return (
    <div className="container">
      <div className="mx-auto mt-14 flex max-w-4xl flex-col lg:items-center lg:text-center">
        <h1 className="leading-tighter mt-4 font-display text-4xl font-bold tracking-tighter md:text-5xl lg:text-5xl">
          <Balancer>Everything starts with identity</Balancer>
        </h1>
        <p className="text-md mt-4 text-fg-muted md:text-lg">
          <Balancer>
            Make your design system, choose your color palette, your favourite icon
            library, your components style and fonts to match you brand identity.
          </Balancer>
        </p>
        <div className="mt-8 flex items-center gap-2">
          <DrawerRoot>
            <Button type="primary" size="lg">
              Explore themes
            </Button>
            <Drawer title="Themes">
              <h4 className="mt-2 text-lg font-semibold">Your themes</h4>
              <p className="text-fg-muted">You didn't save any theme yet</p>
              <h4 className="mt-2 text-lg font-semibold">Pre-built themes</h4>
              <div className="mt-4 grid grid-cols-8 gap-4">
                {Array.from({ length: 8 }, (_, index) => (
                  <div key={index} className="h-[100px] bg-bg-muted"></div>
                ))}
              </div>
            </Drawer>
          </DrawerRoot>
          <DialogRoot>
            <Button variant="outline" size="lg">
              Copy Code
            </Button>
            <Dialog title="Code"></Dialog>
          </DialogRoot>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center justify-center gap-1">
            {[
              { label: "Neutral", color: "#2E2E2E" },
              { label: "Primary", color: "#fff" },
              { label: "Success", color: "#1A9338" },
              { label: "Warning", color: "#E79D13" },
              { label: "Danger", color: "#E5484D" },
              { label: "Info", color: "#0091FF" },
            ].map((color) => (
              <Tooltip key={color.label} content={color.label} delay={0}>
                <Button shape="square" variant="ghost">
                  <div
                    className="size-6 rounded-sm border"
                    style={{ backgroundColor: color.color }}
                  />
                </Button>
              </Tooltip>
            ))}
          </div>
          <ToggleGroup
            value={mode}
            onValueChange={(val) => setMode(val as "light" | "dark")}
            size="sm"
          >
            <ToggleGroupButton value="light" aria-label="Toggle to light mode">
              <SunIcon className="size-4" />
            </ToggleGroupButton>
            <ToggleGroupButton value="dark" aria-label="Toggle to dark mode">
              <MoonIcon className="size-4" />
            </ToggleGroupButton>
          </ToggleGroup>
        </div>
      </div>
      <div className="mt-14 [&>h2]:my-4 [&>h2]:text-3xl [&>h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold">
        <h2>Brand assets</h2>
        <h2>Colors</h2>
        <div className="space-y-4">
          {[
            { name: "Neutral", color: "#000" },
            { name: "Brand", color: "#000" },
            { name: "Success", color: "#000" },
            { name: "Warning", color: "#000" },
            { name: "Danger", color: "#000" },
            { name: "Info", color: "#000" },
          ].map((palette, paletteIndex) => (
            <div key={paletteIndex}>
              <h3>{palette.name}</h3>
              <p className="mb-4 text-fg-muted">
                Neutral is a neutral color and is the foundation of the color system.
                Almost everything in UI design — text, form fields, backgrounds, dividers
                — are usually gray.
              </p>
              <div className="grid grid-cols-8 gap-4">
                {Array.from({ length: 8 }, () => ({
                  name: `${palette.name} 100`,
                  color: palette.color,
                })).map((color, index) => (
                  <div key={index} className="overflow-hidden rounded-md border shadow">
                    <div
                      className="h-20 border-b"
                      style={{ backgroundColor: color.color }}
                    />
                    <div className="p-2 text-sm">
                      <p>{color.name}</p>
                      <p className="text-fg-muted">{color.color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <h2>Icons</h2>
        <h2>Typeface</h2>
        <div className="mt-4">
          <Preview />
        </div>
      </div>
    </div>
  );
}

const Preview = () => {
  const [view, setView] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [fullScreen, setFullScreen] = React.useState(false);
  return (
    <PreviewBase view={view} onViewChange={setView} className="h-[90vh]">
      <DialogRoot isOpen={fullScreen} onOpenChange={setFullScreen}>
        <Button shape="square" variant="ghost" size="sm">
          <Maximize2Icon />
        </Button>
        <AriaModal className="fixed inset-0 z-50 bg-bg-muted">
          <AriaDialog className="h-full outline-none">
            {({ close }) => (
              <PreviewBase view={view} onViewChange={setView}>
                <Button shape="square" variant="ghost" size="sm" onPress={close}>
                  <Minimize2Icon />
                </Button>
              </PreviewBase>
            )}
          </AriaDialog>
        </AriaModal>
      </DialogRoot>
    </PreviewBase>
  );
};

type View = "desktop" | "tablet" | "mobile";

const PreviewBase = ({
  view,
  onViewChange,
  children,
  className,
}: {
  view: View;
  onViewChange: (view: View) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <div className={cn("z-50 flex h-full flex-col rounded border overflow-hidden", className)}>
      <header className="flex items-center justify-between gap-4 border-b bg-bg-muted px-4 py-1.5">
        <div className={cn("flex w-[144px] items-center gap-2", isMobile && "w-[55px]")}>
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <TextField
          prefix={<LockIcon />}
          suffix={
            <Button shape="square" size="sm" variant="ghost" className="size-7">
              <RotateCwIcon />
            </Button>
          }
          value="https://acme.com"
          size="sm"
        />
        <div
          className={cn(
            "flex w-[144px] items-center justify-end gap-2",
            isMobile && "w-[55px]"
          )}
        >
          {!isMobile && (
            <ToggleGroup
              value={view}
              onValueChange={(val) => {
                onViewChange(val as View);
              }}
              size="sm"
            >
              <ToggleGroupButton value="desktop" aria-label="Toggle to desktop view">
                <MonitorIcon className="size-4" />
              </ToggleGroupButton>
              <ToggleGroupButton value="tablet" aria-label="Toggle to tablet view">
                <TabletIcon className="size-4" />
              </ToggleGroupButton>
              <ToggleGroupButton value="mobile" aria-label="Toggle to mobile view">
                <SmartphoneIcon className="size-4" />
              </ToggleGroupButton>
            </ToggleGroup>
          )}
          {children}
        </div>
      </header>
      {/* TODO: fix white background on load https://fvsch.com/transparent-iframes */}
      {/* TODO: Sync beetween the two iframes */}
      <div className="flex w-full flex-1 flex-col items-center">
        <div
          className={cn("flex w-full flex-1 flex-col items-center", {
            "": view === "desktop",
            "max-w-2xl": view === "tablet" && !isMobile,
            "max-w-sm": view === "mobile" && !isMobile,
          })}
        >
          <iframe src="/" className={cn("w-full flex-1")} allowTransparency />
        </div>
      </div>
    </div>
  );
};
