"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  MoonIcon,
  PenIcon,
  SaveIcon,
  SunIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/core/button";
import { Dialog, DialogRoot } from "@/components/core/dialog";
import { MenuRoot, Menu, MenuItem } from "@/components/core/menu";
import { Skeleton } from "@/components/core/skeleton";
import { Tabs, Tab, TabList } from "@/components/core/tabs";
import { ToggleButton } from "@/components/core/toggle-button";
import { Tooltip } from "@/components/core/tooltip";
import { usePreviewMode } from "@/components/mode-provider";
import { useUserThemes } from "@/modules/themes/atoms/themes-atom";
import { ThemeProvider } from "@/modules/themes/components/theme-provider";
import { Theme } from "@/modules/themes/types";
import { PreviewContent } from "../preview";

const ThemeEditorContext = React.createContext<{
  isLoading: boolean;
}>({
  isLoading: false,
});

const useThemeEditorContext = () => React.useContext(ThemeEditorContext);

export function ThemeEditor({
  theme: themeProp,
  isEditable,
}: {
  theme?: Theme | string;
  isEditable: boolean;
}) {
  const { mode: previewMode, setMode: setPreviewMode } = usePreviewMode();

  const [isEditMode, setEditMode] = React.useState(true);
  const isMounted = useMounted();
  const { userThemes } = useUserThemes();

  const theme: Theme | undefined =
    typeof themeProp === "string"
      ? userThemes.find((t) => t.name === themeProp)
      : themeProp;

  const isLoading = !theme;

  if (isMounted && !theme) {
    notFound();
  }

  return (
    <ThemeEditorContext value={{ isLoading }}>
      <div>
        <ThemeEditorHeader
          theme={theme}
          isLoading={isLoading}
          isEditable={isEditable}
          isEditMode={isEditMode}
          setEditMode={setEditMode}
        />
        <ThemeEditorBody>
          <Section
            title="Colors"
            description="Theme color palette and variations"
            action={
              theme?.foundations.light &&
              theme?.foundations.dark &&
              previewMode && (
                <Tabs
                  variant="solid"
                  selectedKey={previewMode}
                  onSelectionChange={(key) =>
                    setPreviewMode(key as "light" | "dark")
                  }
                >
                  <TabList className="[&_svg]:size-4">
                    <Tab id="light">
                      <SunIcon />
                    </Tab>
                    <Tab id="dark">
                      <MoonIcon />
                    </Tab>
                  </TabList>
                </Tabs>
              )
            }
          >
            <ThemeColors theme={theme} />
          </Section>
          <Section title="Typography" description="Theme typography">
            <ThemeTypography />
          </Section>
          <Section title="Iconography" description="Theme iconography">
            <ThemeIconography />
          </Section>
          <Section title="Layout" description="Theme layout">
            <ThemeLayout />
          </Section>
          <Section title="Radius" description="Theme radius">
            <ThemeRadius />
          </Section>
        </ThemeEditorBody>
      </div>
    </ThemeEditorContext>
  );
}

interface ThemeHeaderProps {
  theme?: Theme;
  isLoading: boolean;
  isEditable: boolean;
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
}
export function ThemeEditorHeader({
  theme,
  isLoading,
  isEditable,
  isEditMode,
  setEditMode,
}: ThemeHeaderProps) {
  return (
    <div className="max-lg:bg-bg max-lg:sticky max-lg:top-[57px] max-lg:z-10 max-lg:border-b max-lg:p-4">
      <Link
        href="/themes"
        className="text-fg-muted hover:text-fg flex cursor-pointer items-center gap-1 text-sm"
      >
        <ArrowLeftIcon className="size-4" />
        <span>themes</span>
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">
          <Skeleton show={isLoading}>
            <span>{theme?.name ?? "Forest"}</span>
          </Skeleton>
        </h2>
        <div className="flex items-center gap-2">
          <DialogRoot>
            <Button className="xl:hidden">Preview</Button>
            <Dialog type="drawer" className="h-[80svh] p-0">
              <PreviewContent
                themeName="minimalist"
                collapsible={false}
                resizable={false}
              />
            </Dialog>
          </DialogRoot>
          {isEditable && isEditMode && (
            <Button prefix={<SaveIcon />} size="sm" isDisabled>
              Save theme
            </Button>
          )}
          {isEditable && (
            <Tooltip content="Edit mode" variant="inverse" showArrow>
              <ToggleButton
                isSelected={isEditMode}
                onChange={setEditMode}
                variant="quiet"
                shape="square"
                size="sm"
              >
                <PenIcon />
              </ToggleButton>
            </Tooltip>
          )}
          <MenuRoot>
            <Button shape="square" size="sm">
              <EllipsisVerticalIcon />
            </Button>
            <Menu>
              <MenuItem id="clone">Clone theme</MenuItem>
            </Menu>
          </MenuRoot>
        </div>
      </div>
    </div>
  );
}

function ThemeEditorBody({ children }: { children: React.ReactNode }) {
  return <div className="space-y-10 max-lg:p-4 lg:mt-12">{children}</div>;
}

interface SectionProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
function Section({
  title,
  description,
  action,
  children,
  className,
}: SectionProps) {
  return (
    <section id={title.toLowerCase().replace(" ", "-")}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-fg-muted text-sm">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className={className}>{children}</div>
    </section>
  );
}

function ThemeColors({ theme }: { theme?: Theme }) {
  return (
    <div
      style={
        { "--color-secondary": "var(--color-fg-muted)" } as React.CSSProperties
      }
    >
      <ThemeProvider theme={theme} unstyled>
        <p id="core-colors" className="mt-4 font-medium tracking-tight">
          Core colors
        </p>
        <div className="mt-1 flex gap-1">
          <ColorItem
            colorName="Neutral"
            // colorValue={theme?.foundations}
            className="bg-bg-neutral rounded-sm"
            containerClassName=" ml-0! mr-0!"
          />
          <ColorItem
            className="bg-bg-accent rounded-sm"
            containerClassName=" ml-0! mr-0!"
          />
        </div>
        <div className="mt-1 space-y-1">
          {[
            { name: "neutral", label: "Neutral" },
            { name: "accent", label: "Accent" },
          ].map((shade) => (
            <div key={shade.name} className="flex items-center gap-2">
              <p className="text-(--color-secondary) w-[60px] text-sm">
                {shade.label}
              </p>
              <div className="flex flex-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ColorItem
                    key={i}
                    style={{
                      backgroundColor: `var(--${shade.name}-${(i + 1) * 100})`,
                    }}
                    className="h-8 rounded-sm"
                    containerClassName="not-last:-mr-16 not-first:-ml-16 h-8"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p id="semantic-colors" className="mt-4 font-medium tracking-tight">
          Semantic colors
        </p>
        <div className="mt-1 flex gap-1">
          {/* <Item className="bg-bg-info" /> */}
          <ColorItem
            className="bg-bg-success rounded-sm"
            containerClassName="ml-0! mr-0!"
          />
          <ColorItem
            className="bg-bg-warning rounded-sm"
            containerClassName=" ml-0! mr-0!"
          />
          <ColorItem
            className="bg-bg-danger rounded-sm"
            containerClassName=" ml-0! mr-0!"
          />
        </div>
        <div className="mt-1 space-y-1">
          {[
            { name: "success", label: "Success" },
            { name: "warning", label: "Warning" },
            { name: "danger", label: "Danger" },
            // { name: "info", label: "Info" },
          ].map((shade) => (
            <div key={shade.name} className="flex items-center gap-2">
              <p className="text-(--color-secondary) w-[60px] text-sm">
                {shade.label}
              </p>
              <div className="flex flex-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <ColorItem
                    key={i}
                    style={{
                      backgroundColor: `var(--${shade.name}-${(i + 1) * 100})`,
                    }}
                    className="h-8 rounded-sm"
                    containerClassName="not-last:-mr-16 not-first:-ml-16 h-8"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ThemeProvider>
    </div>
  );
}

interface ColorItemProps {
  containerClassName?: string;
  className?: string;
  style?: React.CSSProperties;
  colorValue?: string;
  colorName?: string;
}
function ColorItem({
  containerClassName,
  className,
  style,
  colorValue = "#000000",
  colorName,
}: ColorItemProps) {
  const { isLoading } = useThemeEditorContext();
  const [isCopied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(colorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Skeleton
      show={isLoading}
      className={cn(
        "not-last:-mr-4 not-first:-ml-4 relative h-12 flex-1",
        containerClassName
      )}
    >
      <button
        onClick={handleCopy}
        className={cn(
          "not-last:-mr-4 not-first:-ml-4 relative h-12 flex-1",
          containerClassName
        )}
        aria-label={`Copy ${colorName || colorValue} color value`}
      >
        <div
          className={cn(
            "hover:h-22 duration-250 group absolute bottom-0 left-0 h-12 w-full cursor-pointer overflow-hidden rounded-t-2xl transition-[height]",
            className
          )}
          style={style}
        >
          <div
            className={cn(
              "flex items-center justify-between p-2 text-sm opacity-0 transition-opacity group-hover:opacity-100",
              isCopied && "opacity-0!"
            )}
          >
            <p>{colorName || "Color"}</p>
            <p>{colorValue}</p>
          </div>
          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity",
              isCopied && "opacity-100"
            )}
          >
            <CheckIcon className="text-fg-muted size-4" />
          </div>
        </div>
      </button>
    </Skeleton>
  );
}

function ThemeTypography() {
  return <div>typography</div>;
}

function ThemeIconography() {
  return <div>iconography</div>;
}

function ThemeLayout() {
  return <div>layout</div>;
}

function ThemeRadius() {
  return <div>radius</div>;
}
