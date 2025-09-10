"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  MinimizeIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react";
import { motion } from "motion/react";

import {
  blocksCategories,
  registryBlocks,
} from "@dotui/registry-definition/registry-blocks";
import { Button } from "@dotui/ui/components/button";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import {
  SelectItem,
  SelectRoot,
  SelectValue,
} from "@dotui/ui/components/select";
import { Separator } from "@dotui/ui/components/separator";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";

import { useSidebarContext } from "@/components/sidebar";
import { useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { useMounted } from "@/hooks/use-mounted";

export const Preview = () => {
  const [isOpen, setOpen] = React.useState(false);
  const { isCollapsed } = useSidebarContext();
  const { containerRef, width, setWidth, handleMouseDown, isDragging } =
    useHorizontalResize({
      minWidth: 320,
      maxWidth: 768,
      initialWidth: 768,
      edge: "left",
    });
  const maxWidth = isCollapsed ? 768 : 600;
  const isMounted = useMounted();

  React.useEffect(() => {
    setOpen(true);
  }, []);

  const previewWidth = Math.min(maxWidth, width ?? maxWidth);
  const containerWidth = isOpen ? previewWidth : 0;

  if (!isMounted) return null;

  return (
    <>
      <motion.div
        key="preview-button"
        initial={{ width: 0 }}
        animate={{
          width: isOpen ? 0 : 110,
          marginLeft: isOpen ? 0 : -110,
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.25 }}
        className="flex justify-start overflow-hidden"
        aria-hidden={isOpen}
        inert={isOpen || undefined}
      >
        <div style={{ width: 110 }} className="p-4">
          <Button
            variant="default"
            size="sm"
            onPress={() => setOpen(true)}
            className="bg-bg-inverse/5 border"
          >
            Preview
          </Button>
        </div>
      </motion.div>
      <div
        onMouseDown={handleMouseDown}
        className="h-15 bg-bg-neutral hover:bg-bg-neutral-hover active:bg-bg-neutral-active absolute -left-3 top-1/2 z-20 w-2 -translate-y-1/2 cursor-col-resize rounded-full shadow-sm"
      />
      <motion.div
        ref={containerRef}
        key="preview-container"
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
          <PreviewContent
            setOpen={setOpen}
            setWidth={setWidth}
            currentWidth={previewWidth}
          />
        </motion.div>
      </motion.div>
    </>
  );
};

export function PreviewContent({
  className,
  collapsible = true,
  setOpen,
  setWidth,
  currentWidth,
}: {
  className?: string;
  collapsible?: boolean;
  setOpen: (isOpen: boolean) => void;
  setWidth: (width: number) => void;
  currentWidth: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const isMobile = currentWidth < 480;
  const pathname = usePathname();
  const segments = pathname.split("/");
  const username = segments[2] ?? "";
  const styleName = segments[3] ?? "";

  const [currentBlockName, setCurrentBlockName] =
    React.useState<string>("login");
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
  }, [currentBlockName]);

  // CSS-only fullscreen overlay; no Fullscreen API
  React.useEffect(() => {
    const root = document.documentElement;
    if (isFullscreen) {
      root.classList.add("overflow-hidden");
    } else {
      root.classList.remove("overflow-hidden");
    }
    return () => root.classList.remove("overflow-hidden");
  }, [isFullscreen]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-bg size-full overflow-hidden rounded-md border",
        isFullscreen &&
          "fixed inset-0 z-50 rounded-none p-4 md:p-8 animate-in zoom-in-90",
        className,
      )}
    >
      <div className="bg-bg-muted/50 flex items-center justify-between gap-2 border-b border-t-[inherit] px-1 py-1">
        <div className="flex items-center gap-1">
          {collapsible && (
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
          )}
          <Separator orientation="vertical" className="h-4" />
          <SelectRoot
            aria-label="Select block"
            onSelectionChange={(key) => setCurrentBlockName(key as string)}
            selectedKey={currentBlockName}
          >
            <Button
              variant="link"
              size="sm"
              suffix={<ChevronsUpDownIcon className="size-3.5!" />}
              className="text-fg-muted h-7 justify-center gap-1 rounded-sm px-2"
            >
              <SelectValue className="flex-0" />
            </Button>
            <Popover>
              <ListBox
                items={blocksCategories
                  .filter((category) => category.slug !== "featured")
                  .map((category) => ({
                    key: category.slug,
                    label: category.name,
                    items: registryBlocks.filter((block) =>
                      block?.categories?.includes(category.slug),
                    ),
                  }))}
              >
                {(section) => (
                  <ListBoxSection
                    id={section.key}
                    title={section.label}
                    items={section.items}
                  >
                    {(item) => (
                      <ListBoxItem id={item.name}>{item.name}</ListBoxItem>
                    )}
                  </ListBoxSection>
                )}
              </ListBox>
            </Popover>
          </SelectRoot>
        </div>
        <div className="flex gap-0.5">
          <Tooltip content={isMobile ? "Mobile" : "Tablet"} delay={0}>
            <Button
              aria-label="Select view"
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
              onPress={() => {
                setWidth(isMobile ? 768 : 430);
              }}
            >
              {isMobile ? <SmartphoneIcon /> : <TabletIcon />}
            </Button>
          </Tooltip>
          <Tooltip content="Open in new tab" delay={0}>
            <Button
              aria-label="Open in new tab"
              href={`/view/${username}/${styleName}/${currentBlockName}`}
              target="_blank"
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
            >
              <ExternalLinkIcon />
            </Button>
          </Tooltip>
          <Tooltip content={isFullscreen ? "Exit fullscreen" : "Fullscreen"} delay={0}>
            <Button
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
              onPress={() => setIsFullscreen((v) => !v)}
            >
              {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
            </Button>
          </Tooltip>
        </div>
      </div>
      <div
        className={cn(
          "size-full",
          isLoading && "bg-bg-muted relative block animate-pulse rounded-md",
        )}
      >
        <iframe
          src={`/view/${username}/${styleName}/${currentBlockName}?mode=true&live=true`}
          onLoad={() => setLoading(false)}
          className={cn(
            "rounded-{inherit] size-full",
            isLoading && "opacity-0",
          )}
        />
      </div>
    </div>
  );
}
