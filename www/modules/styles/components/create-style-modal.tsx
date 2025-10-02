"use client";

import React from "react";
import { useStore } from "@tanstack/react-form";
import { ExternalLinkIcon, GlobeIcon, LockIcon } from "lucide-react";
import { z } from "zod";

import { createStyleSchema as dbCreateStyleSchema } from "@dotui/db/schemas";
import { Alert } from "@dotui/registry/ui/alert";
import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@dotui/registry/ui/dialog";
import { useAppForm } from "@dotui/registry/ui/form";
import { SelectItem } from "@dotui/registry/ui/select";
import type { StyleDefinition } from "@dotui/registry/style-system/types";

import { LoginModal } from "@/modules/auth/components/login-modal";
import { authClient } from "@/modules/auth/lib/client";
import { useCreateStyle } from "../hooks/use-create-style";

const createStyleSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .superRefine((val, ctx) => {
      const normalized = normalizeStyleName(val);
      const result = dbCreateStyleSchema.shape.name.safeParse(normalized);
      if (!result.success) {
        const message = result.error.issues[0]?.message ?? "Invalid style name";
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });
      }
    }),
  visibility: dbCreateStyleSchema.shape.visibility,
});

// Normalize spaces to dashes and uppercase to lowercase
function normalizeStyleName(input: string): string {
  return input.toLowerCase().replace(/\s+/g, "-");
}

type CreateStyleFormData = z.infer<typeof createStyleSchema>;

export function CreateStyleModal({
  children,
  initialStyle,
}: {
  children: React.ReactNode;
  initialStyle?: Partial<StyleDefinition>;
}) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return children;
  }

  if (!session) {
    return <LoginModal>{children}</LoginModal>;
  }

  return (
    <CreateStyleModalContent initialStyle={initialStyle}>
      {children}
    </CreateStyleModalContent>
  );
}

export function CreateStyleModalContent({
  children,
  initialStyle,
}: {
  children: React.ReactNode;
  initialStyle?: Partial<StyleDefinition>;
}) {
  const createStyleMutation = useCreateStyle();
  const [isOpen, setOpen] = React.useState(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      visibility: "unlisted",
    } as CreateStyleFormData,
    validators: {
      onSubmit: createStyleSchema,
    },
    onSubmitInvalid: () => {
      console.log("invalid");
    },
    onSubmit: async ({ value }) => {
      const finalName = normalizeStyleName(value.name);
      await createStyleMutation.mutateAsync({
        ...value,
        name: finalName,
        styleOverrides: initialStyle,
      });
      setOpen(false);
    },
  });

  const rawName = useStore(form.store, (state) => state.values.name);

  const renamedTo = React.useMemo(() => {
    const normalized = normalizeStyleName(rawName);
    return normalized !== rawName ? normalized : null;
  }, [rawName]);

  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setOpen}>
      {children}
      <Dialog modalProps={{ className: "max-w-lg" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogHeading>Create a new style</DialogHeading>
          </DialogHeader>
          <DialogBody>
            {createStyleMutation.isError && (
              <Alert
                variant="danger"
                title={
                  createStyleMutation.error?.message ??
                  "An error occurred while creating the style."
                }
                className="text-xs font-normal"
              />
            )}
            <div className="flex items-start gap-2">
              <form.AppField name="name">
                {(field) => (
                  <field.TextField label="Name" autoFocus className="w-full" />
                )}
              </form.AppField>
              <form.AppField name="visibility">
                {(field) => (
                  <field.Select
                    aria-label="Visibility"
                    renderValue={({ selectedItem }: { selectedItem: any }) => (
                      <div className="[&>svg]:text-fg-muted flex items-center gap-2">
                        {selectedItem?.icon}
                        {selectedItem?.label}
                      </div>
                    )}
                    items={[
                      {
                        value: "private",
                        label: "Private",
                        icon: <LockIcon />,
                        description: "Only you can view and access this style.",
                        disabled: true,
                      },
                      {
                        value: "unlisted",
                        label: "Unlisted",
                        icon: <ExternalLinkIcon />,
                        description:
                          "Anyone with the link can access this style.",
                      },
                      {
                        value: "public",
                        label: "Public",
                        icon: <GlobeIcon />,
                        description:
                          "Anyone can view this style (listed in community styles).",
                      },
                    ]}
                    className="mt-[22px]"
                  >
                    {(item: any) => (
                      <SelectItem
                        id={item.value}
                        prefix={item.icon}
                        label={item.label}
                        textValue={item.value}
                        description={item.description}
                        isDisabled={item.disabled}
                        className="[&>svg]:text-fg-muted! max-w-88"
                      />
                    )}
                  </field.Select>
                )}
              </form.AppField>
            </div>
            {renamedTo && (
              <Alert className="mt-3 text-xs font-normal">
                Your style will be renamed to "{renamedTo}"
              </Alert>
            )}
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <form.AppForm>
              <form.SubmitButton>Create</form.SubmitButton>
            </form.AppForm>
          </DialogFooter>
        </form>
      </Dialog>
    </DialogRoot>
  );
}
