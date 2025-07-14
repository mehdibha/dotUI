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

  return (
    <Skeleton show={!isSuccess}>
      <FormControl
        name="name"
        control={form.control}
        render={({ value, onChange, ...props }) =>
          isEditMode ? (
            <div className="flex items-center gap-2">
              <TextField
                size="sm"
                autoFocus
                value={value}
                onChange={onChange}
                {...props}
              />
              <Button
                size="sm"
                shape="square"
                variant="quiet"
                onClick={() => setEditMode(false)}
              >
                <CheckIcon />
              </Button>
              <Button
                size="sm"
                shape="square"
                variant="quiet"
                onClick={() => {
                  form.resetField("name");
                  setEditMode(false);
                }}
              >
                <XIcon />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl leading-none font-bold">{value}</h1>
              <Button
                size="sm"
                variant="quiet"
                shape="square"
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
