"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { useHorizontalResize } from "@/hooks/use-horizontal-resize";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import { ListBox } from "@/components/ui/list-box";
import { Popover } from "@/components/ui/popover";
import { SelectItem, SelectRoot, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { styles } from "@/modules/registry/registry-styles";

export const Loader = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return <Skeleton show={!isMounted}>{children}</Skeleton>;
};

export const ComponentWrapper = ({
  suspense,
  fallback = <Skeleton className="h-40" />,
  children,
}: {
  suspense?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) => {
  if (suspense) {
    return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
  }
  return children;
};

export const ResizableContainer = ({
  children,
  resizable,
}: {
  children: React.ReactNode;
  resizable?: boolean;
}) => {
  const { containerRef, width, handleMouseDown } = useHorizontalResize({
    // minWidth: 100, // Optional custom minimum width
  });

  if (!resizable) return children;

  return (
    <div
      className="relative overflow-hidden"
      ref={containerRef}
      style={{ width: width !== null ? `${width}px` : undefined }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="h-15 bg-bg-neutral hover:bg-bg-neutral-hover active:bg-bg-neutral-active absolute right-2 top-1/2 z-20 w-2 -translate-y-1/2 cursor-col-resize rounded-full shadow-sm"
      />
      {children}
    </div>
  );
};

export const ComponentPreviewHeader = () => {
  // const { mode: previewMode, setMode: setPreviewMode } = usePreviewMode();
  const { currentStyle, currentMode, setCurrentStyle, setCurrentMode } =
    useStyles();
  const isMounted = useMounted();

  return (
    <div className="absolute left-0 top-0 z-50 flex w-full items-center justify-between gap-2 p-2">
      <SelectRoot
        selectedKey={currentStyle.name}
        onSelectionChange={(key) => setCurrentStyle(key as string)}
      >
        <Button
          size="sm"
          suffix={<ChevronDownIcon className="text-fg-muted" />}
          className="h-7 text-xs"
        >
          <span className="font-bold">style:</span>
          <SelectValue className="text-fg-muted" />
        </Button>
        <Popover>
          <ListBox>
            {styles.map((style) => (
              <SelectItem key={style.name} id={style.name}>
                {style.name}
              </SelectItem>
            ))}
          </ListBox>
        </Popover>
      </SelectRoot>
      {isMounted && (
        <ThemeModeSwitch
          size="sm"
          shape="square"
          isSelected={currentMode === "dark"}
          onChange={(isSelected) =>
            setCurrentMode(isSelected ? "dark" : "light")
          }
        />
      )}
    </div>
  );
};
