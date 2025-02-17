"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/core/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@/components/core/dialog";
import { Form, FormControl } from "@/components/core/form";
// import { RadioGroup, Radio } from "@/components/core/radio-group";
import { TextField } from "@/components/core/text-field";
import { useUserThemes } from "@/modules/themes/atoms/themes-atom";

const formSchema = z.object({
  name: z.string().min(2),
});

export function CreateThemeDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = React.useState(false);
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
      await createTheme(values.name);
      setStatus("success");
      setOpen(false);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error as string);
    }
    setOpen(false);
  };

  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setOpen}>
      {children}
      <Dialog
        title="Create theme"
        description="Create a new theme to get started."
      >
        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogBody className="space-y-4">
            <FormControl
              name="name"
              control={control}
              render={(props) => (
                <TextField label="Name" className="w-full" {...props} />
              )}
            />
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button variant="primary" type="submit" isPending={status === "loading"}>
              Create theme
            </Button>
          </DialogFooter>
        </Form>
      </Dialog>
    </DialogRoot>
  );
}
