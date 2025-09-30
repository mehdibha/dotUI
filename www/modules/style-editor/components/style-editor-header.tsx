"use client";

import Link from "next/link";
import {
  ArrowLeftIcon,
  CodeIcon,
  EyeIcon,
  RocketIcon,
  RotateCcwIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogRoot } from "@dotui/registry/ui/dialog";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import { Tooltip } from "@dotui/registry/ui/tooltip";

import { LoginModal } from "@/modules/auth/components/login-modal";
import { authClient } from "@/modules/auth/lib/client";
import { CodeModal } from "@/modules/style-editor/components/code-modal";
import { PreviewFrame } from "@/modules/style-editor/components/preview";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { CreateStyleModal } from "@/modules/styles/components/create-style-modal";
import { useResolvedModeState } from "../hooks/use-resolved-mode";

export function StyleEditorHeader() {
  return (
    <div className="container max-w-4xl">
      <div className="flex">
        <Link
          href="/styles"
          className="text-fg-muted hover:text-fg inline-flex items-end gap-1 text-sm max-sm:hidden"
        >
          <ArrowLeftIcon className="size-4" /> styles
        </Link>
      </div>
      <div className="flex items-center justify-between gap-4">
        <StyleEditorHeaderName />
        <StyleEditorHeaderActions />
      </div>
    </div>
  );
}

function StyleEditorHeaderName() {
  const form = useStyleEditorForm();
  const { isLoading } = useEditorStyle();
  return (
    <Skeleton show={isLoading}>
      <h1 className="truncate text-lg font-bold leading-none lg:text-2xl">
        <form.Subscribe selector={(state) => state.values.name}>
          {(name) => name}
        </form.Subscribe>
      </h1>
    </Skeleton>
  );
}

function StyleEditorHeaderActions() {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();
  const { data, isPending: isEditorStylePending } = useEditorStyle();

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const isUserAuthenticated = session && session.user;
  const isUserStyle = isUserAuthenticated && session.user.id === data?.userId;

  return (
    <div className="flex items-center gap-1">
      <CodeModal>
        <Button
          size="sm"
          prefix={<CodeIcon />}
          className="@max-md:px-0 @max-md:w-8 @max-md:size-8"
        >
          <span className="@max-md:hidden">Code</span>
        </Button>
      </CodeModal>
      <DialogRoot>
        <Button
          size="sm"
          shape="square"
          aria-label="Preview"
          className="xl:hidden"
        >
          <EyeIcon />
        </Button>
        <Dialog type="drawer" className="p-0! overflow-hidden">
          <div className="h-[80vh]">
            <PreviewFrame block="login" className="h-full" />
          </div>
          <div
            className={cn(
              "absolute right-1 top-1 size-7 rounded-lg",
              resolvedMode === "dark" ? "dark" : "light",
            )}
          >
            <Button slot="close" variant="quiet" size="sm" shape="square">
              <XIcon />
            </Button>
          </div>
        </Dialog>
      </DialogRoot>
      <form.AppForm>
        <Tooltip content="Reset">
          <form.ResetButton aria-label="Reset form" size="sm" shape="square">
            <RotateCcwIcon />
          </form.ResetButton>
        </Tooltip>
      </form.AppForm>
      <Skeleton
        show={isEditorStylePending || isSessionPending}
        className="w-20"
      >
        {isUserAuthenticated ? (
          isUserStyle ? (
            <form.AppForm>
              <form.SubmitButton size="sm" prefix={<SaveIcon />}>
                Save
              </form.SubmitButton>
            </form.AppForm>
          ) : (
            <form.AppForm>
              <CreateStyleModal
                initialStyle={{
                  theme: form.getFieldValue("theme"),
                  icons: form.getFieldValue("icons"),
                  variants: form.getFieldValue("variants"),
                }}
              >
                <form.Subscribe selector={(state) => state.isDirty}>
                  {(isDirty) => (
                    <Button
                      size="sm"
                      variant="primary"
                      isDisabled={!isDirty}
                      className="border-primary hover:border-primary-hover border"
                      prefix={<RocketIcon />}
                    >
                      Publish
                    </Button>
                  )}
                </form.Subscribe>
              </CreateStyleModal>
            </form.AppForm>
          )
        ) : (
          <LoginModal>
            <Button size="sm" variant="primary">
              Publish
            </Button>
          </LoginModal>
        )}
      </Skeleton>
    </div>
  );
}
