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
import {
  blocksCategories,
  registryBlocks,
} from "../../packages/registry-definition/dist/registry-blocks";

export const Preview = () => {
  const [isOpen, setOpen] = React.useState(false);
  const [screen, setScreen] = React.useState<"mobile" | "tablet">("tablet");
  const { isCollapsed } = useSidebarContext();
  const isMounted = useMounted();

  React.useEffect(() => {
    setOpen(true);
  }, []);

  const previewWidth = Math.min(
    screen === "mobile" ? 430 : 768,
    isCollapsed ? 1000 : 600,
  );
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
      <motion.div
        key="preview-container"
        initial={{ width: 0 }}
        animate={{ width: containerWidth }}
        transition={{ type: "spring", bounce: 0, duration: 0.25 }}
        className="h-full overflow-hidden"
        aria-hidden={!isOpen}
        inert={!isOpen || undefined}
      >
        <motion.div
          animate={{ width: containerWidth }}
          transition={{ type: "spring", bounce: 0, duration: 0.25 }}
          className="h-full p-4 pl-0"
        >
          <PreviewContent
            setOpen={setOpen}
            screen={screen}
            setScreen={setScreen}
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
          src={`/block-view/${username}/${styleName}/${currentBlockName}`}
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
