"use client";

import React from "react";
// import {
//   AlertDialogAction,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogRoot,
//   AlertDialogTrigger,
//   AlertDialogCancel,
//   AlertDialogTitle,
//   AlertDialogContent,
//   AlertDialogInset,
// } from "@/lib/components/core/default/alert-dialog";
import { Input } from "@/lib/components/core/default/input";

export default function AlertDialogDemo() {
  return null
  const [inputValue, setInputValue] = React.useState("");

  return (
    <AlertDialogRoot>
      <AlertDialogTrigger variant="danger">Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project</AlertDialogTitle>
          <AlertDialogDescription>
            This project will be deleted, along with all of its settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogInset className="bg-bg-muted px-6 py-4 space-y-2">
          <p>
            To verify, type <span className="font-bold">delete my project</span> below:
          </p>
          <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        </AlertDialogInset>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={inputValue !== "delete my project"}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
