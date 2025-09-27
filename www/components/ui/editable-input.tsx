"use client";

import React from "react";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { cn } from "@dotui/ui/lib/utils";

import { AutoResizeTextField } from "@/components/ui/auto-resize-input";

export function EditableInput({
  onSubmit,
  onCancel,
  value,
  className,
  as: As = "span",
}: {
  onSubmit: (nextValue: string) => void;
  onCancel?: () => void;
  value: string;
  className?: string;
  as?: React.ElementType;
}) {
  const [isEditMode, setEditMode] = React.useState(false);
  const [localValue, setLocalValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleEditStart = React.useCallback(() => {
    setLocalValue(value);
    setEditMode(true);
  }, [value]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();
    setEditMode(false);
  }, [onCancel]);

  const handleSubmit = React.useCallback(() => {
    onSubmit(localValue);
    setEditMode(false);
  }, [localValue, onSubmit]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        inputRef.current &&
        isEditMode
      ) {
        handleCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleCancel, isEditMode]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditMode) {
        handleCancel();
      }
    };
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isEditMode) {
        handleSubmit();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleEnter);
    };
  }, [handleCancel, handleSubmit, isEditMode]);

  if (isEditMode) {
    return (
      <div
        ref={containerRef}
        className={cn("flex items-center gap-2", className)}
      >
        <AutoResizeTextField
          aria-label="Scale name"
          inputRef={inputRef}
          autoFocus
          className="leading-none"
          value={localValue}
          onChange={setLocalValue}
        />
        <Button
          data-slot="button"
          aria-label="Save"
          size="sm"
          shape="square"
          variant="quiet"
          className="size-6"
          onPress={handleSubmit}
        >
          <CheckIcon className="text-fg-success" />
        </Button>
        <Button
          data-slot="button"
          aria-label="Cancel"
          size="sm"
          shape="square"
          variant="quiet"
          className="size-6"
          onPress={handleCancel}
        >
          <XIcon className="text-fg-danger" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <As className="leading-none">{value}</As>
      <Button
        data-slot="button"
        aria-label="Edit scale name"
        size="sm"
        shape="square"
        variant="quiet"
        className="size-6 [&_svg]:size-3"
        onPress={handleEditStart}
      >
        <PencilIcon />
      </Button>
    </div>
  );
}
