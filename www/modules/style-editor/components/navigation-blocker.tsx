"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@tanstack/react-form";
import type { Route } from "next";

import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogBody, DialogFooter } from "@dotui/registry/ui/dialog";

import { env } from "@/env";
import { useDraftStyle } from "../atoms/draft-style-atom";
import { useStyleEditorForm } from "../context/style-editor-provider";

/**
 * Blocks navigation when the form has unsaved changes.
 * Separated component to prevent re-rendering of sibling components.
 */
export function NavigationBlocker() {
  const form = useStyleEditorForm();
  const router = useRouter();
  const isDirty = useStore(form.store, (state) => state.isDirty);
  const { clearDraft } = useDraftStyle();

  const [isOpen, setOpen] = React.useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = React.useState<
    string | null
  >(null);

  // Block browser navigation (refresh, close tab, etc.)
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && env.NODE_ENV === "production") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // We clear the draft when the component mounts/unmounts
  React.useEffect(() => {
    clearDraft();
    return () => {
      clearDraft();
    };
  }, [clearDraft]);

  // Block Next.js client-side navigation
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isDirty) return;

      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href && !link.target) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        // Only block if navigating to a different page
        if (url.pathname !== currentUrl.pathname) {
          e.preventDefault();
          setPendingNavigationUrl(link.href);
          setOpen(true);
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);

  const handleNavigation = () => {
    if (pendingNavigationUrl) {
      const url = new URL(pendingNavigationUrl);
      router.push((url.pathname + url.search + url.hash) as Route);
    }
    setPendingNavigationUrl(null);
  };

  const handleDiscardChanges = () => {
    clearDraft();
    setOpen(false);
    handleNavigation();
  };

  const handleSaveChanges = async () => {
    await form.handleSubmit();
    setOpen(false);
    handleNavigation();
  };

  return (
    <Dialog
      role="alertdialog"
      isDismissable
      title="Unsaved changes"
      isOpen={isOpen}
      onOpenChange={setOpen}
    >
      <DialogBody>
        <p className="text-fg-muted text-sm">
          You have unsaved changes. Are you sure you want to leave? Your changes
          will be lost.
        </p>
      </DialogBody>
      <DialogFooter>
        <Button variant="default" onPress={handleDiscardChanges}>
          Discard changes
        </Button>
        <Button variant="primary" onPress={handleSaveChanges}>
          Save changes
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
