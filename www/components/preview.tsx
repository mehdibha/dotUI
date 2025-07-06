"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  ChevronsRightIcon,
  ChevronsUpDownIcon,
  MonitorIcon,
  SmartphoneIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { featuredBlocks } from "@dotui/registry-definition/registry-blocks";
import { Button } from "@dotui/ui/components/button";
import { ListBox } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import {
  Select,
  SelectItem,
  SelectRoot,
  SelectValue,
} from "@dotui/ui/components/select";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { cn } from "@dotui/ui/lib/utils";

import { useSidebarContext } from "@/components/sidebar";
import { useDebounce } from "@/hooks/use-debounce";
import { useMounted } from "@/hooks/use-mounted";

const PreviewContext = React.createContext<{
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  screen: "desktop" | "mobile";
  setScreen: (screen: "desktop" | "mobile") => void;
}>({
  isOpen: false,
  setOpen: () => {},
  screen: "desktop",
  setScreen: () => {},
});

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = React.useState(false);
  const [screen, setScreen] = React.useState<"desktop" | "mobile">("desktop");

  React.useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <PreviewContext.Provider value={{ isOpen, setOpen, screen, setScreen }}>
      {children}
    </PreviewContext.Provider>
  );
}

export const usePreviewContext = () => React.useContext(PreviewContext);

export const Preview = () => {
  const { isOpen, setOpen, screen } = usePreviewContext();
  const { isCollapsed } = useSidebarContext();
  const isMounted = useMounted();

  const previewWidth = Math.min(
    screen === "mobile" ? 430 : 1000,
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
            className="border bg-bg-inverse/5"
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
          <PreviewContent themeName="het" />
        </motion.div>
      </motion.div>
    </>
  );
};

export function PreviewContent({
  themeName,
  className,
  resizable = true,
  collapsible = true,
}: {
  themeName: string;
  className?: string;
  resizable?: boolean;
  collapsible?: boolean;
}) {
  const { setOpen, screen, setScreen } = usePreviewContext();
  const { style } = useParams<{ style: string }>();
  const [currentBlockName, setCurrentBlockName] = React.useState<string>(
    featuredBlocks[0],
  );
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
  }, [currentBlockName]);

  return (
    <div
      className={cn(
        "size-full overflow-hidden rounded-md border bg-bg",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-t-[inherit] px-1 py-1">
        <div className="flex w-32 items-center gap-3">
          <div className="flex items-center gap-1">
            {collapsible && (
              <Button
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
          onSelectionChange={(key) => setCurrentBlockName(key as string)}
          selectedKey={currentBlockName}
        >
          <Button
            size="sm"
            suffix={<ChevronsUpDownIcon />}
            className="h-7 w-28 justify-center rounded-sm text-fg-muted"
          >
            <SelectValue className="flex-0" />
          </Button>
          <Popover>
            <ListBox
              items={featuredBlocks.map((block) => ({
                key: block,
                label: block,
              }))}
            >
              {(item) => (
                <SelectItem key={item.key} id={item.key}>
                  {item.label}
                </SelectItem>
              )}
            </ListBox>
          </Popover>
        </SelectRoot>
        <div className="flex w-32 justify-end">
          {resizable && (
            <Button
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
              onPress={() =>
                setScreen(screen === "desktop" ? "mobile" : "desktop")
              }
            >
              {screen === "desktop" ? <MonitorIcon /> : <SmartphoneIcon />}
            </Button>
          )}
        </div>
      </div>
      <div
        className={cn(
          "size-full",
          isLoading && "relative block animate-pulse rounded-md bg-bg-muted",
        )}
      >
        <iframe
          src={`/block-view/${style}/${currentBlockName}`}
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
