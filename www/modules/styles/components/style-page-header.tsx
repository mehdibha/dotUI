"use client";

import React from "react";
import Link from "next/link";
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

import { Button } from "@dotui/ui/components/button";
import { FormControl } from "@dotui/ui/components/form";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { TextField } from "@dotui/ui/components/text-field";
import { Tooltip } from "@dotui/ui/components/tooltip";

import { AutoResizeTextField } from "@/components/auto-resize-input";
import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";
import { PublishStyleModal } from "./publish-style-modal";
import { StylePageCodeModal } from "./style-page-code-modal";

export function StylePageHeader() {
  return (
    <div>
      <Link
        href="/styles"
        className="flex items-center gap-1 text-sm text-fg-muted hover:text-fg"
      >
        <ArrowLeftIcon className="size-4" /> styles
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <StylePageHeaderName />
        <div className="flex items-center gap-1">
          <StylePageHeaderActions />
        </div>
      </div>
    </div>
  );
}

function StylePageHeaderName() {
  const { form, isSuccess } = useStyleForm();
  const [isEditMode, setEditMode] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onDismiss = React.useCallback(() => {
    form.resetField("name");
    setEditMode(false);
  }, [form]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        inputRef.current
      ) {
        onDismiss();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onDismiss]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditMode) {
        onDismiss();
      }
    };
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isEditMode) {
        setEditMode(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleEnter);
    };
  }, [onDismiss, isEditMode]);

  return (
    <Skeleton show={!isSuccess}>
      <FormControl
        name="name"
        control={form.control}
        render={(props) =>
          isEditMode ? (
            <div ref={containerRef} className="flex items-center gap-2">
              <AutoResizeTextField
                inputRef={inputRef}
                autoFocus
                className="text-2xl leading-none font-bold"
                {...props}
              />
              <Button
                size="sm"
                shape="square"
                variant="quiet"
                className="size-7"
                onPress={() => setEditMode(false)}
              >
                <CheckIcon className="text-fg-success" />
              </Button>
              <Button
                size="sm"
                shape="square"
                variant="quiet"
                className="size-7"
                onPress={() => {
                  form.resetField("name");
                  setEditMode(false);
                }}
              >
                <XIcon className="text-fg-danger" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl leading-none font-bold">{props.value}</h1>
              <Button
                size="sm"
                variant="quiet"
                shape="square"
                className="size-7 text-fg-muted [&_svg]:size-3.5"
                onClick={() => setEditMode(true)}
              >
                <PencilIcon />
              </Button>
            </div>
          )
        }
      />
    </Skeleton>
  );
}

function StylePageHeaderActions() {
  const { form } = useStyleForm();

  const handleReset = () => {
    form.reset();
  };

  const isUserStyle = true;

  return (
    <>
      <StylePageCodeModal>
        <Button size="sm" prefix={<CodeIcon />}>
          Code
        </Button>
      </StylePageCodeModal>
      <Tooltip content="Reset" delay={0}>
        <Button
          size="sm"
          shape="square"
          isDisabled={!form.formState.isDirty}
          onPress={handleReset}
        >
          <RotateCcwIcon />
        </Button>
      </Tooltip>
      {isUserStyle ? (
        <Button
          type="submit"
          variant="primary"
          size="sm"
          prefix={<SaveIcon />}
          isDisabled={!form.formState.isDirty}
          className="border border-bg-primary hover:border-bg-primary-hover"
        >
          Save
        </Button>
      ) : (
        <PublishStyleModal>
          <Button
            size="sm"
            variant="primary"
            isDisabled={!form.formState.isDirty}
            className="border border-bg-primary hover:border-bg-primary-hover"
            prefix={<RocketIcon />}
          >
            Publish
          </Button>
        </PublishStyleModal>
      )}
      <MenuRoot>
        <Button size="sm" shape="square">
          <EllipsisIcon />
        </Button>
        <Menu
          overlayProps={{
            popoverProps: {
              placement: "bottom right",
            },
          }}
        >
          <MenuItem prefix={<CopyIcon />}>Clone</MenuItem>
          {isUserStyle && (
            <>
              <MenuItem prefix={<StarIcon />}>Favorite</MenuItem>
              <MenuItem prefix={<PencilIcon />}>Rename</MenuItem>
              <MenuItem variant="danger" prefix={<Trash2Icon />}>
                Delete style
              </MenuItem>
            </>
          )}
        </Menu>
      </MenuRoot>
    </>
  );
}
