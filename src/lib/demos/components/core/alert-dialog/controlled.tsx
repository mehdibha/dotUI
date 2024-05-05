"use client";

import React from "react";
import { AlertDialog } from "@/lib/components/core/default/alert-dialog";
import { Button } from "@/lib/components/core/default/button";

export default function AlertDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setOpen(true);
        }}
      >
        Show Dialog
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={setOpen}
        action={{ label: "Continue" }}
        cancel={{ label: "Cancel" }}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account
        and remove your data from our servers."
      />
    </>
  );
}
