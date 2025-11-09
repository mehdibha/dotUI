"use client";

import { useEffect } from "react";
import { useIframeContext } from "@/hooks/use-iframe-context";

/**
 * Component that disables focus trapping when rendered inside an iframe.
 * This prevents focus traps from interfering with the parent page.
 */
export function DisableFocusTrap() {
  const isInIframe = useIframeContext();

  useEffect(() => {
    if (!isInIframe) return;

    // Prevent all focus events from bubbling to parent window
    const stopFocusPropagation = (e: Event) => {
      e.stopPropagation();
    };

    // Intercept focus events in capture phase before they can bubble
    const events = ["focusin", "focusout", "focus", "blur"] as const;

    events.forEach((eventType) => {
      document.addEventListener(eventType, stopFocusPropagation, true);
    });

    return () => {
      events.forEach((eventType) => {
        document.removeEventListener(eventType, stopFocusPropagation, true);
      });
    };
  }, [isInIframe]);

  return null;
}
