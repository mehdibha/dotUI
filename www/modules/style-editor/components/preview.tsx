"use client";

import React from "react";
import type { Route } from "next";
import Link from "next/link";
import {
  ChevronsRightIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  MinimizeIcon,
  MoonIcon,
  SmartphoneIcon,
  SunIcon,
  TabletIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { registryBlocks } from "@dotui/registry/blocks/registry";
import { createScopedContext } from "@dotui/registry/lib/context";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { DialogContent } from "@dotui/registry/ui/dialog";
import { Modal } from "@dotui/registry/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Separator } from "@dotui/registry/ui/separator";
import { useSidebarContext } from "@dotui/registry/ui/sidebar";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

import { useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { useMounted } from "@/hooks/use-mounted";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";
import { useStyleEditorParams } from "@/modules/style-editor/hooks/use-style-editor-params";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

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
  const { isOpen: isSidebarOpen } = useSidebarContext("Preview");
  const { containerRef, width, setWidth, handleMouseDown, isDragging } =
    useHorizontalResize({
      minWidth: 320,
      maxWidth: 768,
      initialWidth: 768,
      edge: "left",
    });
  const maxWidth = isSidebarOpen ? 600 : 768;
  const isMounted = useMounted();

  React.useEffect(() => {
    setOpen(true);
  }, []);

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
        <div style={{ width: 102 }} className="pt-6 pr-6">
          <Button variant="default" size="sm" onPress={() => setOpen(true)}>
            Preview
          </Button>
        </div>
      </motion.div>
      <button
        type="button"
        aria-label="Resize panel"
        role="separator"
        aria-orientation="horizontal"
        aria-valuenow={previewWidth}
        aria-valuemin={320}
        aria-valuemax={maxWidth}
        tabIndex={0}
        onMouseDown={handleMouseDown}
        className="absolute top-1/2 -left-3 z-20 h-15 w-2 -translate-y-1/2 cursor-col-resize rounded-full bg-neutral shadow-sm hover:bg-neutral-hover active:bg-neutral-active"
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
            className={cn(
              "flex size-full flex-col overflow-hidden rounded-md border bg-bg",
            )}
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
  const { activeMode, setActiveMode } = usePreferences();
  const { supportsLightDark } = useResolvedModeState();

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
    <div className="flex items-center justify-between gap-2 border-b border-t-inherit bg-card p-1">
      <div className="flex items-center gap-1">
        <Button
          aria-label="Collapse preview"
          variant="quiet"
          size="sm"
          className="size-7"
          onPress={() => setOpen(false)}
        >
          <ChevronsRightIcon />
        </Button>
        <Separator orientation="vertical" className="h-4" />
        <Select value={block} onChange={(key) => setBlock(key as string)}>
          <SelectTrigger variant="link" size="sm" className="h-7" />
          <SelectContent
            items={registryBlocks.filter((block) =>
              block?.categories?.includes("featured"),
            )}
          >
            {(item) => <SelectItem id={item.name}>{item.name}</SelectItem>}
          </SelectContent>
        </Select>
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
              className="size-7 selected:bg-transparent selected:text-fg selected:hover:bg-inverse/10 selected:pressed:bg-inverse/20"
            >
              {({ isSelected }) => (isSelected ? <SunIcon /> : <MoonIcon />)}
            </ToggleButton>
          </Skeleton>
        )}
        <Tooltip>
          <Button
            aria-label="Select view"
            variant="quiet"
            size="sm"
            className="size-7"
            onPress={() => setPreviewWidth(isMobile ? 768 : 430)}
          >
            {isMobile ? <SmartphoneIcon /> : <TabletIcon />}
          </Button>
          <TooltipContent>{isMobile ? "Mobile" : "Tablet"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button
            asChild
            aria-label="Open in new tab"
            variant="quiet"
            size="sm"
            className="size-7"
          >
            <Link
              target="_blank"
              href={
                `/view/${slug}/${block}?mode=true&live=true&view=true` as Route
              }
            >
              <ExternalLinkIcon />
            </Link>
          </Button>
          <TooltipContent>Open in new tab</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button
            aria-label="Enter fullscreen"
            variant="quiet"
            size="sm"
            className="size-7"
            onPress={() => setFullscreen(!fullScreen)}
          >
            {fullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </Button>
          <TooltipContent>Fullscreen</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function PreviewContent({ className }: { className?: string }) {
  const { block } = usePreviewContext("PreviewFrame");
  return <PreviewFrame block={block} className={className} />;
}

export const PreviewFrame = ({
  block,
  className,
}: {
  block: string;
  className?: string;
}) => {
  const { slug } = useStyleEditorParams();
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div
      className={cn(
        "flex-1",
        className,
        isLoading && "relative block animate-pulse rounded-md bg-muted",
      )}
    >
      <iframe
        title="Preview"
        src={`/view/${slug}/${block}?mode=true&live=true`}
        onLoad={() => setLoading(false)}
        className={cn("rounded-{inherit] size-full", isLoading && "opacity-0")}
      />
    </div>
  );
};

const PreviewModal = ({ children }: { children: React.ReactNode }) => {
  const { isFullscreen, setFullscreen } = usePreviewContext("PreviewModal");
  return (
    <Modal
      isOpen={isFullscreen}
      onOpenChange={setFullscreen}
      className="w-screen h-(--visual-viewport-height) max-w-none! rounded-none border-0"
    >
      <DialogContent className="p-0! h-full gap-0">{children}</DialogContent>
    </Modal>
  );
};
