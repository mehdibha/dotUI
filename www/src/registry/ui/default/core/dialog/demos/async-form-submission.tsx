"use client";

import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import {
  DialogRoot,
  Dialog,
  DialogFooter,
} from "@/registry/ui/default/core/dialog";
import { TextField } from "@/registry/ui/default/core/text-field";

export default function DialogDemo() {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
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
                isLoading={isLoading}
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
