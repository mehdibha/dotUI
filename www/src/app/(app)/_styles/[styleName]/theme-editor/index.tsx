"use client";

// import { usePreviewMode } from "@/components/mode-provider";
// import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import React from "react";
import Link from "next/link";
// import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  PenIcon,
  SaveIcon,
} from "lucide-react";

// import { useMounted } from "@/hooks/use-mounted";
import { Alert } from "@dotui/ui/components/alert";
import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";
import type { Style } from "@dotui/style-engine/types";

import { PreviewContent } from "../../preview";
// import { ThemeColors } from "./colors";
import { ThemeEditorContext } from "./context";

// import { ThemeTypography } from "./typography";

export function ThemeEditor({
  style,
  isEditable,
}: {
  style: Style;
  isEditable: boolean;
}) {
  // const { currentMode, setCurrentMode } = useStyles();
  const [isEditMode, setEditMode] = React.useState(false);

  const isLoading = false;

  return (
    <ThemeEditorContext
      value={{ isLoading: false, isEditMode: isEditable && isEditMode }}
    >
      <div className="[&_[data-slot=label]]:text-sm">
        <ThemeEditorHeader
          style={style}
          isLoading={isLoading}
          isEditable={isEditable}
          isEditMode={isEditMode}
          setEditMode={setEditMode}
        />
        <ThemeEditorBody>
          {!isEditable && (
            <Alert>
              To adjust colors, fonts, radius, components and more, you need to
              clone the theme.
            </Alert>
          )}
          <Section
            title="Colors"
            description="Theme color palette and variations"
            // action={
            //   <ThemeModeSwitch
            //     isSelected={currentMode === "dark"}
            //     onChange={(isSelected) =>
            //       setCurrentMode(isSelected ? "dark" : "light")
            //     }
            //   />
            // }
          >
            {/* <ThemeColors style={style} /> */}
          </Section>
          <Section title="Typography" description="Theme typography">
            {/* <ThemeTypography /> */}
          </Section>
          {/* <Section title="Iconography" description="Theme iconography">
            <ThemeIconography />
          </Section>
          <Section title="Components" description="Theme components">
            <ThemeComponents />
          </Section> */}
        </ThemeEditorBody>
      </div>
    </ThemeEditorContext>
  );
}

interface ThemeHeaderProps {
  style: Style;
  isLoading: boolean;
  isEditable: boolean;
  isEditMode: boolean;
  setEditMode: (value: boolean) => void;
}
export function ThemeEditorHeader({
  style,
  isLoading,
  isEditable,
  isEditMode,
  setEditMode,
}: ThemeHeaderProps) {
  return (
    <div className="max-lg:bg-bg max-lg:sticky max-lg:top-[57px] max-lg:z-10 max-lg:border-b max-lg:p-4">
      <Link
        href="/styles"
        className="text-fg-muted hover:text-fg flex cursor-pointer items-center gap-1 text-sm"
      >
        <ArrowLeftIcon className="size-4" />
        <span>styles</span>
      </Link>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold tracking-tight">
          <Skeleton show={isLoading}>
            <span>{style.name}</span>
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
