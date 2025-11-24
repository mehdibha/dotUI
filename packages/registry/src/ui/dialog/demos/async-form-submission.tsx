"use client";

import React from "react";
import { Form } from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { Overlay } from "@dotui/registry/ui/overlay";
import { TextField } from "@dotui/registry/ui/text-field";

export default function DialogDemo() {
  const [isPending, setIsPending] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsPending(false);
  };

  return (
    <Dialog>
      <Button>Edit username</Button>
      <Overlay>
        <DialogContent>
          {({ close }) => (
            <>
              <DialogHeader>
                <DialogHeading>Edit username</DialogHeading>
                <DialogDescription>
                  Make changes to your profile.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <Form
                  onSubmit={(e) => {
                    handleSubmit(e);
                    close();
                  }}
                >
                  <TextField autoFocus defaultValue="@mehdibha" isRequired>
                    <Label>Username</Label>
                    <Input className="w-full" />
                  </TextField>
                </Form>
              </DialogBody>
              <DialogFooter>
                <Button variant="default" slot="close">
                  Cancel
                </Button>
                <Button type="submit" isPending={isPending} variant="primary">
                  Save changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Overlay>
    </Dialog>
  );
}
