"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  MaximizeIcon,
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
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";

import { useSidebarContext } from "@/components/sidebar";
import { useMounted } from "@/hooks/use-mounted";

export const Preview = () => {
  const [isOpen, setOpen] = React.useState(false);
  const [screen, setScreen] = React.useState<"mobile" | "tablet">("tablet");
  const { isCollapsed } = useSidebarContext();
  const isMounted = useMounted();

  // Resizable width state
  const [resizedWidth, setResizedWidth] = React.useState<number | null>(null);
  const [hasUserResized, setHasUserResized] = React.useState(false);
  const [isDragging, setDragging] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startWidthRef = React.useRef(0);
  const maxAllowedWidthRef = React.useRef(0);
  const moveListenerRef = React.useRef<((e: MouseEvent) => void) | null>(null);
  const upListenerRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    setOpen(true);
  }, []);

  const maxAllowedWidth = isCollapsed ? 1000 : 600;
  maxAllowedWidthRef.current = maxAllowedWidth;

  const targetDeviceWidth = screen === "mobile" ? 430 : 768;
  const defaultWidth = Math.min(targetDeviceWidth, maxAllowedWidth);

  // Keep width within bounds on env changes
  React.useEffect(() => {
    if (!hasUserResized) {
      setResizedWidth(defaultWidth);
    } else if (resizedWidth != null && resizedWidth > maxAllowedWidth) {
      setResizedWidth(maxAllowedWidth);
    }
  }, [screen, isCollapsed, hasUserResized, resizedWidth, defaultWidth, maxAllowedWidth]);

  const containerWidth = isOpen
    ? Math.min(resizedWidth ?? defaultWidth, maxAllowedWidth)
    : 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    isDraggingRef.current = true;
    setDragging(true);
    startXRef.current = e.clientX;
    startWidthRef.current = containerRef.current.offsetWidth;
    setHasUserResized(true);

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = ev.clientX - startXRef.current;
      const nextWidth = Math.max(
        0,
        Math.min(startWidthRef.current - deltaX, maxAllowedWidthRef.current),
      );
      setResizedWidth(nextWidth);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      setDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      moveListenerRef.current = null;
      upListenerRef.current = null;
    };

    moveListenerRef.current = onMouseMove;
    upListenerRef.current = onMouseUp;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Cleanup listeners if component unmounts during a drag
  React.useEffect(() => {
    return () => {
      if (moveListenerRef.current) {
        document.removeEventListener("mousemove", moveListenerRef.current);
      }
      if (upListenerRef.current) {
        document.removeEventListener("mouseup", upListenerRef.current);
      }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      isDraggingRef.current = false;
    };
  }, []);

  if (!isMounted) return null;

  const transition = isDragging
    ? { duration: 0 }
    : { type: "spring", bounce: 0, duration: 0.25 };

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
      <motion.div
        key="preview-container"
        initial={{ width: 0 }}
        animate={{ width: containerWidth }}
        transition={transition}
        className="h-full overflow-hidden relative group"
        aria-hidden={!isOpen}
        inert={!isOpen || undefined}
        ref={containerRef}
      >
        {/* Resize handle */}
        <div
          aria-label="Resize preview"
          onMouseDown={handleMouseDown}
          className="absolute left-0 top-0 z-10 h-full w-1.5 cursor-col-resize bg-transparent transition-colors group-hover:bg-fg/10"
        />
        <div
          style={{ width: containerWidth }}
          className="h-full p-4 pl-0"
        >
          <PreviewContent
            setOpen={setOpen}
            screen={screen}
            setScreen={(next) => {
              setScreen(next);
            }}
          />
        </div>
      </motion.div>
    </>
  );
};

export function PreviewContent({
  className,
  collapsible = true,
  setOpen,
  screen,
  setScreen,
}: {
  className?: string;
  collapsible?: boolean;
  setOpen: (isOpen: boolean) => void;
  screen: "mobile" | "tablet";
  setScreen: (screen: "mobile" | "tablet") => void;
}) {
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

  return (
    <div
      className={cn(
        "bg-bg size-full overflow-hidden rounded-md border",
        className,
      )}
    >
      <div className="bg-bg-muted/50 flex items-center justify-between gap-2 border-b border-t-[inherit] px-1 py-1">
        <div className="flex w-32 items-center gap-3">
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
          </div>
        </div>
        <SelectRoot
          aria-label="Select block"
          onSelectionChange={(key) => setCurrentBlockName(key as string)}
          selectedKey={currentBlockName}
        >
          <Button
            size="sm"
            suffix={<ChevronsUpDownIcon />}
            className="text-fg-muted h-7 min-w-32 justify-center rounded-sm"
          >
            <SelectValue className="flex-0" />
          </Button>
          <Popover>
            <ListBox
              items={blocksCategories.map((category) => ({
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
        <div className="flex w-32 justify-end gap-0.5">
          <Tooltip
            content={screen === "mobile" ? "Mobile" : "Tablet"}
            delay={0}
          >
            <Button
              aria-label="Select view"
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
              onPress={() =>
                setScreen(screen === "mobile" ? "tablet" : "mobile")
              }
            >
              {screen === "mobile" && <SmartphoneIcon />}
              {screen === "tablet" && <TabletIcon />}
            </Button>
          </Tooltip>
          <Tooltip content="Open in new tab" delay={0}>
            <Button
              aria-label="Open in new tab"
              href={`/block-view/${username}/${styleName}/${currentBlockName}`}
              target="_blank"
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
            >
              <ExternalLinkIcon />
            </Button>
          </Tooltip>
          <Tooltip content="Maximize" delay={0}>
            <Button
              aria-label="Maximize"
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
            >
              <MaximizeIcon />
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
          src={`/block-view/${username}/${styleName}/${currentBlockName}?mode=true&live=true`}
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
