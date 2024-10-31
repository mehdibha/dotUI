"use client";

import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCwIcon,
} from "lucide-react";
import { Button } from "@/registry/ui/default/core/button";
import { cn } from "@/registry/ui/default/lib/cn";

export function Preview() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [iframeIsLoading, setIframeLoading] = React.useState(true);
  const [currentPathname, setCurrentPathname] = React.useState("");

  const reload = () => {
    if (iframeRef.current) {
      setIframeLoading(true);
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
    <div className="bg-bg size-full overflow-hidden rounded border">
      <div className="bg-bg-muted flex items-center justify-between gap-2 border-b py-1 pl-4 pr-2">
        <div className="flex w-32 items-center gap-3">
          {/* window controls (decorative) */}
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-red-500" />
            <div className="size-3 rounded-full bg-yellow-500" />
            <div className="size-3 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-1">
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
              isDisabled={iframeIsLoading}
              variant="quiet"
              shape="square"
              size="sm"
              className="size-7"
            >
              <RotateCwIcon className={cn(iframeIsLoading && "animate-spin")} />
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
        <div className="w-32"></div>
      </div>
      <iframe
        ref={iframeRef}
        src="/preview"
        className="rounded-{inherit] size-full"
        onLoad={() => {
          setIframeLoading(false);
        }}
      />
    </div>
  );
}
