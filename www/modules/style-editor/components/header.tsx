"use client";
"use no memo";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  EllipsisIcon,
  EyeIcon,
  PencilIcon,
  RocketIcon,
  RotateCcwIcon,
  SaveIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";

import { useMounted } from "@/hooks/use-mounted";
import { LoginModal } from "@/modules/auth/components/login-modal";
import { authClient } from "@/modules/auth/lib/client";
import { CreateStyleModal } from "@/modules/styles/components/create-style-modal";
import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";
import { useStyleEditorForm } from "../context/style-editor-provider";
import { useEditorStyle } from "../hooks/use-editor-style";
import { CodeModal } from "./code-modal";

export function StyleEditorHeader() {
  const form = useStyleEditorForm();
  const { isLoading } = useEditorStyle();

  return (
    <div className="container max-w-4xl">
      <Link
        href="/styles"
        className="text-fg-muted hover:text-fg flex items-center gap-1 text-sm max-sm:hidden"
      >
        <ArrowLeftIcon className="size-4" /> styles
      </Link>
      <div className="flex items-center justify-between gap-4">
        <Skeleton show={isLoading}>
          <h1 className="text-2xl font-bold leading-none">
            {form.watch("name")}
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
  const { form } = useStyleForm();
  const [isCodeModalOpen, setIsCodeModalOpen] = React.useState(false);
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
      <CodeModal isOpen={isCodeModalOpen} onOpenChange={setIsCodeModalOpen}>
        <Button
          size="sm"
          prefix={<CodeIcon />}
          className="@max-md:px-0 @max-md:w-8 max-md:hidden"
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
          <Preview />
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
              className="border-bg-primary hover:border-bg-primary-hover border"
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
          <MenuItem
            prefix={<CodeIcon />}
            onAction={() => setIsCodeModalOpen(true)}
          >
            Code
          </MenuItem>
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
    </Skeleton>
  );
}

const Preview = () => {
  const [isLoading, setLoading] = React.useState(true);
  const pathname = usePathname();
  const segments = pathname.split("/");
  const username = segments[2] ?? "";
  const styleName = segments[3] ?? "";

  return (
    <Skeleton show={isLoading}>
      <iframe
        src={`/view/${username}/${styleName}/login?mode=true&live=true`}
        onLoad={() => setLoading(false)}
        className={cn(
          "size-full h-[90vh] rounded-t-md",
          isLoading && "opacity-0",
        )}
      />
    </Skeleton>
  );
};
