"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";
import {
  DialogRoot,
  Dialog,
  DialogFooter,
  DialogInset,
} from "@/components/dynamic-core/dialog";
import { TextField } from "@/components/dynamic-core/text-field";

export default function Demo() {
  return (
    <DialogRoot>
      <Button variant="outline">Edit Profile</Button>
      <Dialog title="Edit profile" description="Make changes to your profile.">
        {({ close }) => (
          <>
            <DialogInset className="bg-bg-muted mb-4 border-y">
              Content within the inset.
            </DialogInset>
            <div className="space-y-4">
              <TextField
                autoFocus
                label="Name"
                defaultValue="Mehdi"
                className="w-full"
              />
              <TextField
                label="Username"
                defaultValue="@mehdibha_"
                className="w-full"
              />
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
                variant="primary"
                size={{ initial: "lg", sm: "md" }}
                onPress={close}
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
