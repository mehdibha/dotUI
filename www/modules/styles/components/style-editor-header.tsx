"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  EllipsisIcon,
  PencilIcon,
  RocketIcon,
  RotateCcwIcon,
  SaveIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { Pressable } from "react-aria-components";

import { Button } from "@dotui/ui/components/button";
import { FormControl } from "@dotui/ui/components/form";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Tooltip } from "@dotui/ui/components/tooltip";

import { AutoResizeTextField } from "@/components/auto-resize-input";
import { useMounted } from "@/hooks/use-mounted";
import { SignInModal } from "@/modules/auth/components/sign-in-modal";
import { authClient } from "@/modules/auth/lib/client";
import { StyleEditorDeleteModal } from "@/modules/styles/components/style-editor-delete-modal";
import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";
import { CreateStyleModal } from "./create-style-modal";
import { StyleEditorCodeModal } from "./style-editor-code-modal";

export function StyleEditorHeader() {
  return (
    <div className="container max-w-4xl">
      <Link
        href="/styles"
        className="flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeftIcon className="size-4" /> styles
      </Link>
      <div className="mt-1 flex items-center justify-between lg:mt-2">
        <StyleEditorHeaderName />
        <div className="flex items-center gap-1">
          <StyleEditorHeaderActions />
        </div>
      </div>
    </div>
  );
}

function StyleEditorHeaderName() {
  const { form, isSuccess } = useStyleForm();
  const value = form.watch("name");

  const [isEditMode, setEditMode] = React.useState(false);
  const [localValue, setLocalValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleEditStart = React.useCallback(() => {
    setLocalValue(value);
    setEditMode(true);
  }, [value]);

  const handleSubmit = React.useCallback(() => {
    form.setValue("name", localValue, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setEditMode(false);
  }, [form, localValue]);

  const handleCancel = React.useCallback(() => {
    setEditMode(false);
  }, []);

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
      <div ref={containerRef} className="flex items-center gap-2">
        <AutoResizeTextField
          aria-label="Style name"
          inputRef={inputRef}
          autoFocus
          className="text-2xl leading-none font-bold"
          value={localValue}
          onChange={setLocalValue}
        />
        <Button
          aria-label="Save"
          size="sm"
          shape="square"
          variant="quiet"
          className="size-7"
          onPress={handleSubmit}
        >
          <CheckIcon className="text-fg-success" />
        </Button>
        <Button
          aria-label="Cancel"
          size="sm"
          shape="square"
          variant="quiet"
          className="size-7"
          onPress={handleCancel}
        >
          <XIcon className="text-fg-danger" />
        </Button>
      </div>
    );
  }

  return (
    <Skeleton show={!isSuccess}>
      <FormControl
        name="name"
        control={form.control}
        render={(props) => (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl leading-none font-bold">{props.value}</h1>
            <Button
              aria-label="Edit"
              size="sm"
              variant="quiet"
              shape="square"
              className="size-7 text-fg-muted [&_svg]:size-3.5"
              onPress={() => handleEditStart()}
            >
              <PencilIcon />
            </Button>
          </div>
        )}
      />
    </Skeleton>
  );
}

function StyleEditorHeaderActions() {
  const { form } = useStyleForm();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const authorUsername = segments[2] ?? "";

  const { data: session, isPending } = authClient.useSession();
  const isMounted = useMounted();

  const handleReset = () => {
    form.reset();
  };

  const styleUserId = form.getValues("userId");
  const isUserAuthenticated = Boolean(session?.user?.id);
  const isUserStyle = Boolean(
    isUserAuthenticated &&
      ((styleUserId && session?.user?.id === styleUserId) ||
        (session?.user?.username &&
          authorUsername &&
          session.user.username === authorUsername)),
  );

  return (
    <Skeleton show={!isMounted || isPending}>
      <StyleEditorCodeModal>
        <Button size="sm" prefix={<CodeIcon />}>
          Code
        </Button>
      </StyleEditorCodeModal>
      <Tooltip content="Reset" delay={0}>
        <Button
          aria-label="Reset form"
          size="sm"
          shape="square"
          isDisabled={!form.formState.isDirty}
          onPress={handleReset}
        >
          <RotateCcwIcon />
        </Button>
      </Tooltip>
      {isUserAuthenticated ? (
        isUserStyle ? (
          <Button
            type="submit"
            variant="primary"
            size="sm"
            prefix={<SaveIcon />}
            isPending={form.formState.isSubmitting}
            isDisabled={!form.formState.isDirty || form.formState.isSubmitting}
          >
            Save
          </Button>
        ) : (
          <CreateStyleModal
            initialStyle={{
              theme: form.getValues("theme"),
              icons: form.getValues("icons"),
              variants: form.getValues("variants"),
            }}
          >
            <Button
              size="sm"
              variant="primary"
              isDisabled={!form.formState.isDirty}
              className="border border-bg-primary hover:border-bg-primary-hover"
              prefix={<RocketIcon />}
            >
              Publish
            </Button>
          </CreateStyleModal>
        )
      ) : (
        <SignInModal>
          <Button size="sm" variant="primary">
            Publish
          </Button>
        </SignInModal>
      )}
      {isUserStyle && (
        <>
          <MenuRoot>
            <Button aria-label="More actions" size="sm" shape="square">
              <EllipsisIcon />
            </Button>
            <Menu
              overlayProps={{
                popoverProps: {
                  placement: "bottom right",
                },
              }}
            >
              <StyleEditorDeleteModal>
                <Pressable>
                  <MenuItem variant="danger" prefix={<Trash2Icon />}>
                    Delete style
                  </MenuItem>
                </Pressable>
              </StyleEditorDeleteModal>
            </Menu>
          </MenuRoot>
        </>
      )}
    </Skeleton>
  );
}
