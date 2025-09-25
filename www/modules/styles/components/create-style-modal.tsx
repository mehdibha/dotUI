"use client";

import React from "react";
import { ExternalLinkIcon, GlobeIcon, LockIcon } from "lucide-react";
import { z } from "zod";
// import { parseDate } from "@internationalized/date";
import { useForm } from "@tanstack/react-form";

import { createStyleSchema as dbCreateStyleSchema } from "@dotui/db/schemas";
import { Alert } from "@dotui/ui/components/alert";
import { Button } from "@dotui/ui/components/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { FormControl } from "@dotui/ui/components/form";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { TextArea } from "@dotui/ui/components/text-area";
import { TextField } from "@dotui/ui/components/text-field";
import { cn } from "@dotui/ui/lib/utils";
import type { StyleDefinition } from "@dotui/style-engine/types";

import { LoginModal } from "@/modules/auth/components/login-modal";
import { authClient } from "@/modules/auth/lib/client";
import { useCreateStyle } from "../hooks/use-create-style";

const createStyleSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    // TODO: deprecated
    .superRefine((val, ctx) => {
      const normalized = normalizeStyleName(val);
      const result = dbCreateStyleSchema.shape.name.safeParse(normalized);
      if (!result.success) {
        const message = result.error.issues[0]?.message ?? "Invalid style name";
        ctx.addIssue({ code: z.ZodIssueCode.custom, message });
      }
    }),
  description: z.string().optional(),
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
  const { data: session } = authClient.useSession();

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

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      visibility: "unlisted",
    },
    onSubmit: ({ value, meta }) => {
      onSubmit(value as CreateStyleFormData, (meta as unknown as () => void) ?? (() => {}));
    },
  });

  const RenamedTo = () => (
    <form.Subscribe selector={(s) => s.values.name}>
      {(rawName) => {
        const normalized = normalizeStyleName(rawName ?? "");
        const renamedTo = normalized !== rawName ? normalized : null;
        return renamedTo ? (
          <Alert className="mt-3 text-xs font-normal">
            Your style will be renamed to "{renamedTo}"
          </Alert>
        ) : null;
      }}
    </form.Subscribe>
  );

  const onSubmit = (data: CreateStyleFormData, close: () => void) => {
    const finalName = normalizeStyleName(data.name);
    createStyleMutation.mutate(
      {
        ...data,
        name: finalName,
        styleOverrides: initialStyle,
      },
      {
        onSuccess: () => {
          close();
        },
      },
    );
  };

  return (
    <DialogRoot>
      {children}
      <Dialog modalProps={{ className: "max-w-lg" }}>
        {({ close }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(close);
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
              <div className="flex items-end gap-2">
                <FormControl
                  form={form}
                  name="name"
                  render={({ value, onChange, ...props }) => (
                    <TextField
                      label="Name"
                      autoFocus
                      className="w-full"
                      {...props}
                      value={value ?? ""}
                      onChange={onChange}
                    />
                  )}
                />
                <FormControl
                  form={form}
                  name="visibility"
                  render={({ value, onChange, ...props }) => (
                    <Select
                      aria-label="Visibility"
                      selectedKey={value}
                      onSelectionChange={onChange}
                      renderValue={({ selectedItem }) => (
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
                          description:
                            "Only you can view and access this style.",
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
                          description: "Anyone can view this style.",
                        },
                      ]}
                      {...props}
                    >
                      {(item) => (
                        <SelectItem
                          id={item.value}
                          prefix={item.icon}
                          label={item.label}
                          textValue={item.value}
                          description={item.description}
                          isDisabled={item.disabled}
                          className="[&>svg]:text-fg-muted!"
                        />
                      )}
                    </Select>
                  )}
                />
              </div>
              <FormControl
                form={form}
                name="description"
                render={({ value, onChange, ...props }) => (
                  <TextArea
                    label="Description (optional)"
                    className="mt-3 w-full"
                    {...props}
                    value={value ?? ""}
                    onChange={onChange}
                  />
                )}
              />
              <RenamedTo />
            </DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button
                variant="primary"
                type="submit"
                isPending={createStyleMutation.isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        )}
      </Dialog>
    </DialogRoot>
  );
}
