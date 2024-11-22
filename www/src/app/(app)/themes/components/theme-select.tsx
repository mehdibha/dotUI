"use client";

import React from "react";
import { chain, mergeRefs } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import {
  CheckIcon,
  CopyIcon,
  Edit2Icon,
  GitBranchIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import {
  TextField as UnstyledTextField,
  Input as UnstyledInput,
} from "react-aria-components";
import { dotUIThemes } from "@/lib/themes";
import { useThemes } from "@/hooks/use-themes";
import { Alert } from "@/registry/ui/default/core/alert";
import { Button } from "@/registry/ui/default/core/button";
import { Form } from "@/registry/ui/default/core/form";
import { InputProps } from "@/registry/ui/default/core/input";
import { Kbd } from "@/registry/ui/default/core/kbd";
import { Menu, MenuItem, MenuRoot } from "@/registry/ui/default/core/menu";
import { Skeleton } from "@/registry/ui/default/core/skeleton";
import { cn } from "@/registry/ui/default/lib/cn";
import { CloneThemeDialog } from "./clone-theme";
import { CopyThemeDialog } from "./copy-theme";
import { DeleteThemeDialog } from "./delete-theme";

export function ThemeSelect({ className }: { className?: string }) {
  const {
    isLoading,
    currentTheme,
    setThemeName,
    isCurrentThemeEditable,
    themes: userThemes,
    setCurrentThemeId,
    showKeyboardHint,
    setShowKeyboardHint,
  } = useThemes();
  const [isCloneDialogOpen, setIsCloneDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      const themes = [...dotUIThemes, ...userThemes];
      const themesCount = themes.length;
      const currentIndex = themes.findIndex(
        (theme) => theme.id === currentTheme.id
      );

      if (e.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % themesCount;
        const nextTheme = themes[nextIndex];
        if (nextTheme) {
          setCurrentThemeId(nextTheme.id);
          setShowKeyboardHint(false);
        }
      } else if (e.key === "ArrowLeft") {
        const prevIndex =
          currentIndex === 0 ? themesCount - 1 : currentIndex - 1;
        const prevTheme = themes[prevIndex];
        if (prevTheme) {
          setCurrentThemeId(prevTheme.id);
          setShowKeyboardHint(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTheme.id, userThemes, setCurrentThemeId, setShowKeyboardHint]);

  return (
    <div className="space-y-4">
      <div className={cn("flex items-center justify-between pl-1", className)}>
        <Skeleton show={isLoading}>
          <ThemeName
            currentName={currentTheme.name}
            setCurrentName={setThemeName}
            isEditable={isCurrentThemeEditable}
          />
        </Skeleton>
        <div className="flex items-center gap-2">
          <CopyThemeDialog>
            <Button prefix={<CopyIcon />}>Copy code</Button>
          </CopyThemeDialog>
          <MenuRoot>
            <Button shape="square">
              <MoreHorizontalIcon />
            </Button>
            <Menu placement="bottom end">
              <MenuItem
                prefix={<GitBranchIcon />}
                onAction={() => {
                  setIsCloneDialogOpen(true);
                }}
              >
                Clone theme
              </MenuItem>
              {isCurrentThemeEditable && (
                <MenuItem
                  prefix={<Trash2Icon />}
                  variant="danger"
                  onAction={() => {
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete theme
                </MenuItem>
              )}
            </Menu>
          </MenuRoot>
          <CloneThemeDialog
            isOpen={isCloneDialogOpen}
            onOpenChange={setIsCloneDialogOpen}
          />
          <DeleteThemeDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </div>
      </div>
      {!isLoading && showKeyboardHint && (
        <Alert
          fill
          action={
            <Button
              variant="quiet"
              size="sm"
              shape="square"
              onPress={() => setShowKeyboardHint(false)}
            >
              <XIcon />
            </Button>
          }
          className="[&_kbd]:text-xs"
        >
          Use <Kbd>Ctrl</Kbd> + <Kbd>→</Kbd> or <Kbd>←</Kbd> to navigate between
          themes
        </Alert>
      )}
      {!isLoading && !isCurrentThemeEditable && (
        <Alert
          fill
          action={
            <CloneThemeDialog>
              <Button prefix={<GitBranchIcon />}>Clone theme</Button>
            </CloneThemeDialog>
          }
        >
          To adjust, preview and generate color palette, fonts, radius and more,
          you need to clone the theme.
        </Alert>
      )}
    </div>
  );
}

const ThemeName = ({
  currentName,
  setCurrentName,
  isEditable,
}: {
  currentName: string;
  setCurrentName: (value: string) => void;
  isEditable: boolean;
}) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>(currentName);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onDismiss = React.useCallback(() => {
    setEditMode(false);
    setInputValue(currentName);
  }, [currentName]);

  const onSave = React.useCallback(() => {
    setCurrentName(inputValue);
    setEditMode(false);
  }, [inputValue, setCurrentName]);

  const onEdit = () => {
    setEditMode(true);
    setInputValue(currentName);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onDismiss]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editMode) {
        onDismiss();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onDismiss, editMode]);

  if (!isEditable) {
    return (
      <h2 className="font-heading pb-px text-2xl font-semibold">
        {currentName}
      </h2>
    );
  }

  return (
    <Form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="flex items-center gap-2"
    >
      {editMode ? (
        <>
          <UnstyledTextField value={inputValue} onChange={setInputValue}>
            <AutoResizeInput
              ref={inputRef}
              className="font-heading w-auto text-2xl font-semibold"
            />
          </UnstyledTextField>
          <div className="flex items-center gap-1">
            <Button
              type="submit"
              variant="quiet"
              size="sm"
              shape="square"
              className="[&_svg]:text-fg-success size-7 [&_svg]:size-3.5"
            >
              <CheckIcon />
            </Button>
            <Button
              variant="quiet"
              size="sm"
              shape="square"
              className="[&_svg]:text-fg-danger size-7 [&_svg]:size-3.5"
              onPress={onDismiss}
            >
              <XIcon />
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-heading pb-px text-2xl font-semibold">
            {currentName}
          </h2>
          <Button
            variant="quiet"
            size="sm"
            shape="square"
            className="[&_svg]:text-fg-muted size-7 [&_svg]:size-3.5"
            onPress={onEdit}
          >
            <Edit2Icon />
          </Button>
        </>
      )}
    </Form>
  );
};

const AutoResizeInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, className, ...props }, forwardedRef) => {
    const [inputValue, setInputValue] = useControlledState(
      props.value,
      props.defaultValue ?? "",
      () => {}
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    const onWidthChange = React.useCallback(() => {
      if (inputRef.current) {
        const input = inputRef.current;
        input.style.width = "0";
        input.style.width = `${input.scrollWidth}px`;
      }
    }, [inputRef]);

    React.useLayoutEffect(() => {
      if (inputRef.current) {
        onWidthChange();
      }
    }, [onWidthChange, inputValue, inputRef]);

    return (
      <UnstyledInput
        ref={mergeRefs(inputRef, forwardedRef)}
        onChange={chain(onChange, setInputValue)}
        className={cn(
          "border-fg min-w-[10px] focus:border-b focus:outline-hidden",
          className
        )}
        {...props}
      />
    );
  }
);
AutoResizeInput.displayName = "AutoResizeInput";
