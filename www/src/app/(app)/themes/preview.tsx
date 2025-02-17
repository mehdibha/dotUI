"use client";

import React from "react";
import { useParams, usePathname } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRightIcon,
  MonitorIcon,
  RotateCwIcon,
  SmartphoneIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/core/button";
import { useSidebarContext } from "@/components/sidebar";
import { useCurrentTheme } from "@/modules/themes/atoms/themes-atom";

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
    setOpen(true)
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
  const pathname = usePathname();
  const shouldOpen = pathname.startsWith("/themes/");
  const { isCollapsed } = useSidebarContext();
  const { currentTheme } = useCurrentTheme();
  const isMounted = useMounted();
  const params = useParams<{ themeName?: string }>();

  const themeName = params?.themeName ?? currentTheme.name;

  const previewWidth = Math.min(
    screen === "mobile" ? 430 : 768,
    isCollapsed ? 768 : 600
  );
  const containerWidth = isOpen && shouldOpen ? previewWidth : 0;

  if (!isMounted) return null;

  return (
    <>
      <motion.div
        key="preview-button"
        initial={{ width: 0 }}
        animate={{ width: isOpen || !shouldOpen ? 0 : 110 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="flex justify-start overflow-hidden"
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
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="h-full overflow-hidden"
      >
        <motion.div
          animate={{ width: previewWidth }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="h-full p-4 pl-0"
        >
          <PreviewContent themeName={themeName} />
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
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [isLoading, setLoading] = React.useState(false);
  const [currentPathname, setCurrentPathname] = React.useState("");

  const reload = () => {
    if (iframeRef.current) {
      setLoading(true);
      iframeRef.current.contentWindow?.location.reload();
    }
  };

  const goBack = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.history.back();
    }
  };

  const goForward = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.history.forward();
    }
  };

  const updateUrl = React.useCallback(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const iframeUrl =
        iframeRef.current.contentWindow.location.pathname.replace(
          "/preview",
          ""
        );
      if (iframeUrl && iframeUrl !== currentPathname) {
        setCurrentPathname(iframeUrl);
      }
    }
  }, [currentPathname]);

  React.useEffect(() => {
    // Poll for URL changes every second
    const urlCheckInterval = setInterval(() => {
      updateUrl();
    }, 1000);

    return () => clearInterval(urlCheckInterval);
  }, [updateUrl]);

  return (
    <div
      className={cn(
        "bg-bg size-full overflow-hidden rounded-md border",
        className
      )}
    >
      <div className="bg-bg-muted flex items-center justify-between gap-2 border-b border-t-[inherit] p-1">
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
            <Button
              onPress={goBack}
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              onPress={goForward}
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
            >
              <ChevronRightIcon />
            </Button>
            <Button
              onPress={reload}
              isDisabled={isLoading}
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
            >
              <RotateCwIcon className={cn(isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
        <Button
          href={`/preview${currentPathname}`}
          className="h-7 rounded-sm text-sm font-normal"
          variant="quiet"
          size="sm"
        >
          acme.com{currentPathname}
        </Button>
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
      <iframe
        ref={iframeRef}
        src={`/preview/${themeName}`}
        className="rounded-{inherit] size-full"
        onLoad={() => {
          setLoading(false);
        }}
      />
    </div>
  );
}
