"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";
import {
  DialogRoot,
  Dialog,
  DialogFooter,
} from "@/components/dynamic-core/dialog";
import { TextField } from "@/components/dynamic-core/text-field";

export default function DialogDemo() {
  const [isPending, setIsPending] = React.useState(false);
  const handleSubmit = async () => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsPending(false);
  };
  return (
    <DialogRoot>
      <Button variant="outline">Edit Profile</Button>
      <Dialog title="Edit profile" description="Make changes to your profile.">
        {({ close }) => (
          <>
            <div className="space-y-4">
              <TextField
                autoFocus
                label="Name"
                defaultValue="Mehdi"
                className="w-full"
              />
              <TextField label="Username" defaultValue="@mehdibha_" />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size={{ initial: "lg", sm: "md" }}
                onPress={close}
              >
                Cancel
              </Button>
              <Button
                isPending={isPending}
                variant="primary"
                size={{ initial: "lg", sm: "md" }}
                onPress={async () => {
                  await handleSubmit();
                  close();
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogRoot>
  );
}
