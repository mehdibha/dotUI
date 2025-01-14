"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";
import {
  DialogRoot,
  Dialog,
  DialogFooter,
} from "@/components/dynamic-core/dialog";
import { TextField } from "@/components/dynamic-core/text-field";

export default function Demo() {
  return (
    <DialogRoot>
      <Button variant="outline">Edit Profile</Button>
      <Dialog
        title="Edit profile"
        description="Make changes to your profile."
        className="space-y-4"
      >
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
        <DialogFooter>
          <Button slot="close" variant="outline">
            Cancel
          </Button>
          <Button slot="close" variant="primary">
            Save changes
          </Button>
        </DialogFooter>
      </Dialog>
    </DialogRoot>
  );
}
