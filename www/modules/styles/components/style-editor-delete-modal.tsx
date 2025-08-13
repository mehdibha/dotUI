"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { toast } from "@dotui/ui/components/toast";

import { useTRPC, useTRPCClient } from "@/lib/trpc/react";
import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";

export function StyleEditorDeleteModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const username = segments[2] ?? "";
  const styleName = segments[3] ?? "";

  const { styleId } = useStyleForm();
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!styleId) throw new Error("Missing style id");
      return await trpcClient.style.delete.mutate({ id: styleId });
    },
    onMutate: async () => {
      // Optimistically remove the style cache
      const queryKey = trpc.style.getByNameAndUsername.queryKey({
        name: styleName,
        username,
      });
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.removeQueries({ queryKey });
      return { previous, queryKey } as const;
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
      toast.add({ title: "Failed to delete style", variant: "danger" });
    },
    onSuccess: (deleted) => {
      if (deleted?.name) {
        toast.add({ title: `Style ${deleted.name} deleted`, variant: "info" });
      }
      // Invalidate styles list queries
      queryClient.invalidateQueries({ queryKey: ["trpc", "style"] });
      router.push("/styles");
    },
  });

  return (
    <DialogRoot>
      {children}
      <Dialog
        role="alertdialog"
        title="Delete style"
        description="Are you sure you want to delete this style? This action cannot be undone."
        modalProps={{
          className: "max-w-sm p-2",
        }}
      >
        <DialogBody className="pt-0">
          This will permanently remove the style and its configuration.
        </DialogBody>
        <DialogFooter>
          <Button slot="close" variant="outline">
            Cancel
          </Button>
          <Button
            slot="close"
            variant="danger"
            isPending={deleteMutation.isPending}
            onPress={() => deleteMutation.mutate()}
          >
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogRoot>
  );
}
