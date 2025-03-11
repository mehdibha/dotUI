"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  PenIcon,
  SaveIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Alert } from "@/components/core/alert";
import { Button } from "@/components/core/button";
import { Dialog, DialogRoot } from "@/components/core/dialog";
import { MenuRoot, Menu, MenuItem } from "@/components/core/menu";
import { Skeleton } from "@/components/core/skeleton";
import { ToggleButton } from "@/components/core/toggle-button";
import { Tooltip } from "@/components/core/tooltip";
import { usePreviewMode } from "@/components/mode-provider";
import { useUserThemes } from "@/modules/themes/atoms/themes-atom";
import { CreateThemeDialog } from "@/modules/themes/components/create-theme-dialog";
import { Theme } from "@/modules/themes/types";
import { PreviewContent } from "../../preview";
import { ThemeColors } from "./colors";
import { ThemeComponents } from "./components";
import { ThemeEditorContext } from "./context";
import { ThemeIconography } from "./iconography";
import { ModeSwitch } from "./mode-switch";
import { ThemeTypography } from "./typography";

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
    <ThemeEditorContext
      value={{ isLoading, isEditMode: isEditable && isEditMode }}
    >
      <div className="[&_[data-slot=label]]:text-fg-muted [&_[data-slot=label]]:text-sm">
        <ThemeEditorHeader
          theme={theme}
          isLoading={isLoading}
          isEditable={isEditable}
          isEditMode={isEditMode}
          setEditMode={setEditMode}
        />
        <ThemeEditorBody>
          {!isEditable && (
            <Alert
              action={
                <CreateThemeDialog clonedThemeName={theme?.name}>
                  <Button variant="primary">Clone theme</Button>
                </CreateThemeDialog>
              }
            >
              To adjust colors, fonts, radius, components and more, you need to
              clone the theme.
            </Alert>
          )}
          <Section
            title="Colors"
            description="Theme color palette and variations"
            action={
              theme?.foundations.light &&
              theme?.foundations.dark &&
              previewMode && (
                <ModeSwitch
                  isSelected={previewMode === "dark"}
                  onChange={(isSelected) =>
                    setPreviewMode(isSelected ? "dark" : "light")
                  }
                />
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
          <Section title="Components" description="Theme components">
            <ThemeComponents />
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
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-fg-muted text-sm">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className={cn("pt-2", className)}>{children}</div>
    </section>
  );
}
