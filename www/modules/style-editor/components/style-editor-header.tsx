"use client";
"use no memo";

import React from "react";
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
import { useWatch } from "react-hook-form";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Tooltip } from "@dotui/ui/components/tooltip";

import { useMounted } from "@/hooks/use-mounted";
import { LoginModal } from "@/modules/auth/components/login-modal";
import { authClient } from "@/modules/auth/lib/client";
import { CreateStyleModal } from "@/modules/styles/components/create-style-modal";
import { useStyleEditorForm } from "../context/style-editor-provider";
import { useEditorStyle } from "../hooks/use-editor-style";
import { CodeModal } from "./code-modal";
import { PreviewFrame } from "./preview";

export function StyleEditorHeader() {
  const { isLoading } = useEditorStyle();
  const form = useStyleEditorForm();

  const styleName = useWatch({
    control: form.control,
    name: "name",
  });

  return (
    <div className="container max-w-4xl">
      <Link
        href="/styles"
        className="text-fg-muted hover:text-fg inline-flex items-center gap-1 text-sm max-sm:hidden"
      >
        <ArrowLeftIcon className="size-4" /> styles
      </Link>
      <div className="flex items-center justify-between gap-4">
        <Skeleton show={isLoading}>
          <h1 className="truncate text-lg font-bold leading-none lg:text-2xl">
            {styleName}
          </h1>
        </Skeleton>
        <div className="flex items-center gap-1">
          <StyleEditorHeaderActions />
        </div>
      </div>
    </div>
  );
}

function StyleEditorHeaderActions() {
  const form = useStyleEditorForm();
  const [isCodeModalOpen, setIsCodeModalOpen] = React.useState(false);
  const { data, isLoading } = useEditorStyle();

  const { data: session, isPending } = authClient.useSession();
  const isMounted = useMounted();

  const handleReset = () => {
    form.reset();
  };

  const isUserAuthenticated = session && session.user;
  const isUserStyle = isUserAuthenticated && session.user.id === data?.userId;

  return (
    <Skeleton show={!isMounted || isPending || isLoading}>
      <CodeModal isOpen={isCodeModalOpen} onOpenChange={setIsCodeModalOpen}>
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
          <Button
            slot="close"
            variant="quiet"
            size="sm"
            shape="square"
            className="absolute right-1 top-1 size-7 rounded-lg"
          >
            <XIcon />
          </Button>
        </Dialog>
      </DialogRoot>
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
              className="border-primary hover:border-primary-hover border"
              prefix={<RocketIcon />}
            >
              Publish
            </Button>
          </CreateStyleModal>
        )
      ) : (
        <LoginModal>
          <Button size="sm" variant="primary">
            Publish
          </Button>
        </LoginModal>
      )}
    </Skeleton>
  );
}
