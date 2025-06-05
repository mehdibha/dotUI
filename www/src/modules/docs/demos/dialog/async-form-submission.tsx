"use client";

import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@/components/dynamic-ui/dialog";
import { TextField } from "@/components/dynamic-ui/text-field";
import { Form } from "react-aria-components";

export default function DialogDemo() {
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsPending(false);
  };

  return (
    <DialogRoot>
      <Button>Edit username</Button>
      <Dialog title="Edit username" description="Make changes to your profile.">
        {({ close }) => (
          <Form
            onSubmit={(e) => {
              handleSubmit(e);
              close();
            }}
          >
            <DialogBody>
              <TextField
                autoFocus
                label="Username"
                defaultValue="@mehdibha_"
                isRequired
                className="w-full"
              />
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" slot="close">
                Cancel
              </Button>
              <Button type="submit" isPending={isPending} variant="primary">
                Save changes
              </Button>
            </DialogFooter>
          </Form>
        )}
      </Dialog>
    </DialogRoot>
  );
}
