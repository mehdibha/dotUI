"use client";

import React from "react";
import { Button } from "@/lib/components/core/default/button";
import {
  DialogRoot,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@/lib/components/core/default/dialog";
import { TextField } from "@/lib/components/core/default/text-field";

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
            <DialogBody>
              <TextField autoFocus label="Name" defaultValue="Mehdi" />
              <TextField label="Username" defaultValue="@mehdibha_" />
            </DialogBody>
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
                type="primary"
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
