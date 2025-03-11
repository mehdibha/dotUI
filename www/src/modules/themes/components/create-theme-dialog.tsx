"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useControlledState } from "@react-stately/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert } from "@/components/core/alert";
import { Button } from "@/components/core/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@/components/core/dialog";
import { Form, FormControl } from "@/components/core/form";
import { TextField } from "@/components/core/text-field";
import { useUserThemes } from "@/modules/themes/atoms/themes-atom";

const formSchema = z.object({
  name: z.string().min(2),
});

export function CreateThemeDialog({
  isOpen: isOpenProp,
  onOpenChange: onOpenChangeProp,
  clonedThemeName,
  children,
}: {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  clonedThemeName?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [isOpen, setOpen] = useControlledState(
    isOpenProp,
    false,
    onOpenChangeProp
  );

  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const { createTheme } = useUserThemes();

  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setStatus("loading");
      setErrorMessage(null);
      await createTheme(values.name, clonedThemeName);
      setStatus("success");
      router.push(`/themes/${values.name}`);
      setOpen(false);
    } catch (error) {
      setStatus("error");
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setOpen}>
      {children}
      <Dialog
        title={clonedThemeName ? "Clone theme" : "Create theme"}
        description={
          clonedThemeName
            ? "Clone a theme to get started."
            : "Create a new theme to get started."
        }
      >
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogBody className="space-y-4">
            {status === "error" && errorMessage && (
              <Alert variant="danger">{errorMessage}</Alert>
            )}
            <FormControl
              name="name"
              control={control}
              render={(props) => (
                <TextField
                  autoFocus
                  label="Name"
                  className="w-full"
                  {...props}
                />
              )}
            />
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button
              variant="primary"
              type="submit"
              isPending={status === "loading"}
            >
              Create theme
            </Button>
          </DialogFooter>
        </Form>
      </Dialog>
    </DialogRoot>
  );
}
