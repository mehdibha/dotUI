"use client";

import React from "react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { useStore } from "@tanstack/react-form";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/registry/ui/dialog";

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

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = React.useState<
    string | null
  >(null);

  // Block browser navigation (refresh, close tab, etc.)
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
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
          setIsDialogOpen(true);
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
    setIsDialogOpen(false);
    handleNavigation();
  };

  const handleSaveChanges = async () => {
    await form.handleSubmit();
    handleNavigation();
  };

  return (
    <Dialog
      role="alertdialog"
      isDismissable
      title="Unsaved changes"
      isOpen={isDialogOpen}
      onOpenChange={setIsDialogOpen}
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
