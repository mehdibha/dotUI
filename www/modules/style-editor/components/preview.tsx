"use client";

import React from "react";
import {
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  MinimizeIcon,
  MoonIcon,
  SmartphoneIcon,
  SunIcon,
  TabletIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useWatch } from "react-hook-form";
import type { Route } from "next";

import {
  blocksCategories,
  registryBlocks,
} from "@dotui/registry-definition/registry-blocks";
import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";
import { Separator } from "@dotui/ui/components/separator";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn, createScopedContext } from "@dotui/ui/lib/utils";

import { useSidebarContext } from "@/components/sidebar";
import { useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { useMounted } from "@/hooks/use-mounted";
import { useStyleEditorParams } from "@/modules/style-editor/hooks/use-style-editor-params";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useStyleEditorForm } from "../context/style-editor-provider";
import { useEditorStyle } from "../hooks/use-editor-style";

export const Preview = () => {
  return (
    <PreviewRoot>
      <PreviewToolbar />
      <PreviewContent />
      <PreviewModal>
        <PreviewToolbar fullScreen />
        <PreviewContent />
      </PreviewModal>
    </PreviewRoot>
  );
};

interface PreviewContextType {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  block: string;
  setBlock: (block: string) => void;
  previewWidth: number;
  setPreviewWidth: (previewWidth: number) => void;
  isFullscreen: boolean;
  setFullscreen: (isFullscreen: boolean) => void;
}
const [PreviewProvider, usePreviewContext] =
  createScopedContext<PreviewContextType>("PreviewRoot");

export const PreviewRoot = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setOpen] = React.useState(false);
  const [isFullscreen, setFullscreen] = React.useState(false);
  const [block, setBlock] = React.useState<string>("login");
  const { isCollapsed } = useSidebarContext();
  const { containerRef, width, setWidth, handleMouseDown, isDragging } =
    useHorizontalResize({
      minWidth: 320,
      maxWidth: 788,
      initialWidth: 788,
      edge: "left",
    });
  const maxWidth = isCollapsed ? 788 : 600;
  const isMounted = useMounted();

  React.useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  const previewWidth = Math.min(maxWidth, width ?? maxWidth);
  const containerWidth = isOpen ? previewWidth : 0;

  if (!isMounted) return null;

  return (
    <PreviewProvider
      isOpen={isOpen}
      setOpen={setOpen}
      block={block}
      setBlock={setBlock}
      previewWidth={previewWidth}
      setPreviewWidth={setWidth}
      isFullscreen={isFullscreen}
      setFullscreen={setFullscreen}
    >
      <motion.div
        key="preview-button"
        initial={{ width: 0 }}
        animate={{
          width: isOpen ? 0 : 102,
          marginLeft: isOpen ? 0 : -102,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.25 }}
        className="flex justify-start overflow-hidden"
        aria-hidden={isOpen}
        inert={isOpen || undefined}
      >
        <div style={{ width: 102 }} className="pr-6 pt-6">
          <Button variant="default" size="sm" onPress={() => setOpen(true)}>
            Preview
          </Button>
        </div>
      </motion.div>
      <div
        onMouseDown={handleMouseDown}
        className="h-15 bg-neutral hover:bg-neutral-hover active:bg-neutral-active absolute -left-3 top-1/2 z-20 w-2 -translate-y-1/2 cursor-col-resize rounded-full shadow-sm"
      />
      <motion.div
        ref={containerRef}
        style={{ width: containerWidth }}
        {...(!isDragging
          ? {
              initial: { width: 0 },
              animate: { width: containerWidth },
              transition: { type: "spring", bounce: 0, duration: 0.25 },
            }
          : {})}
        className="h-full overflow-hidden"
        aria-hidden={!isOpen}
        inert={!isOpen || undefined}
      >
        <motion.div
          style={{ width: previewWidth }}
          {...(!isDragging
            ? {
                animate: { width: previewWidth },
                transition: { type: "spring", bounce: 0, duration: 0.25 },
              }
            : {})}
          className="h-full p-4 pl-0"
        >
          <div
            className={cn("bg-bg size-full overflow-hidden rounded-md border")}
          >
            {children}
          </div>
        </motion.div>
      </motion.div>
    </PreviewProvider>
  );
};

function PreviewToolbar({ fullScreen }: { fullScreen?: boolean }) {
  const { isSuccess } = useEditorStyle();
  const form = useStyleEditorForm();
  const { activeMode, setActiveMode } = usePreferences();
  const activeModes = useWatch({
    control: form.control,
    name: "theme.colors.activeModes",
  });

  const supportsLightDark =
    activeModes.includes("light") && activeModes.includes("dark");

  const {
    previewWidth,
    setPreviewWidth,
    setOpen,
    block,
    setBlock,
    setFullscreen,
  } = usePreviewContext("PreviewToolbar");
  const { slug } = useStyleEditorParams();

  const isMobile = previewWidth < 480;

  return (
    <div className="bg-card flex items-center justify-between gap-2 border-b border-t-[inherit] px-1 py-1">
      <div className="flex items-center gap-1">
        <Button
          aria-label="Collapse preview"
          variant="quiet"
          shape="square"
          size="sm"
          className="size-7"
          onPress={() => setOpen(false)}
        >
          <ChevronsRightIcon />
        </Button>
        <Separator orientation="vertical" className="h-4" />
        <SelectRoot
          aria-label="Select block"
          onSelectionChange={(key) => setBlock(key as string)}
          selectedKey={block}
          className="w-auto"
        >
          <Button
            variant="link"
            size="sm"
            suffix={<ChevronsUpDownIcon className="size-3.5!" />}
            className="text-fg-muted h-7 justify-center gap-1 rounded-sm px-2"
          >
            <SelectValue className="flex-0" />
          </Button>
          <Popover className="min-w-36">
            <ListBox
              items={registryBlocks.filter((block) =>
                block?.categories?.includes("featured"),
              )}
            >
              {(item) => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
            </ListBox>
          </Popover>
        </SelectRoot>
      </div>
      <div className="flex gap-0.5">
        {supportsLightDark && (
          <Skeleton show={!isSuccess}>
            <ToggleButton
              isSelected={activeMode === "light"}
              onChange={(isSelected) => {
                setActiveMode(isSelected ? "light" : "dark");
              }}
              size="sm"
              shape="square"
              className="selected:bg-transparent selected:text-fg selected:hover:bg-inverse/10 selected:pressed:bg-inverse/20 size-7"
            >
              {({ isSelected }) => (
                <>{isSelected ? <SunIcon /> : <MoonIcon />}</>
              )}
            </ToggleButton>
          </Skeleton>
        )}
        <Tooltip content={isMobile ? "Mobile" : "Tablet"} delay={0}>
          <Button
            aria-label="Select view"
            variant="quiet"
            shape="square"
            size="sm"
            className="size-7"
            onPress={() => setPreviewWidth(isMobile ? 768 : 430)}
          >
            {isMobile ? <SmartphoneIcon /> : <TabletIcon />}
          </Button>
        </Tooltip>
        <Tooltip content="Open in new tab" delay={0}>
          <Button
            aria-label="Open in new tab"
            target="_blank"
            variant="quiet"
            shape="square"
            size="sm"
            className="size-7"
            href={`/view/${slug}/${block}?mode=true&live=true` as Route}
          >
            <ExternalLinkIcon />
          </Button>
        </Tooltip>
        <Tooltip content="Fullscreen" delay={0}>
          <Button
            aria-label="Enter fullscreen"
            variant="quiet"
            shape="square"
            size="sm"
            className="size-7"
            onPress={() => setFullscreen(!fullScreen)}
          >
            {fullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

function PreviewContent() {
  const { block } = usePreviewContext("PreviewFrame");
  return <PreviewFrame block={block} />;
}

export const PreviewFrame = ({ block }: { block: string }) => {
  const { slug } = useStyleEditorParams();
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
  }, [block]);

  return (
    <div
      className={cn(
        "size-full",
        isLoading && "bg-muted relative block animate-pulse rounded-md",
      )}
    >
      <iframe
        src={`/view/${slug}/${block}?mode=true&live=true`}
        onLoad={() => setLoading(false)}
        className={cn("rounded-{inherit] size-full", isLoading && "opacity-0")}
      />
    </div>
  );
};

const PreviewModal = ({ children }: { children: React.ReactNode }) => {
  const { isFullscreen } = usePreviewContext("PreviewModal");
  return (
    <DialogRoot isOpen={isFullscreen}>
      <Dialog
        type="modal"
        mobileType="modal"
        modalProps={{
          className:
            "w-screen h-(--visual-viewport-height) max-w-none rounded-none border-0",
        }}
        className="p-0! h-full overflow-hidden rounded-none"
        isDismissable
      >
        {children}
      </Dialog>
    </DialogRoot>
  );
};
