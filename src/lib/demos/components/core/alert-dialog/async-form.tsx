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
// } from "@/lib/components/core/default/alert-dialog";

export default function AlertDialogDemo() {
  return null;
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsLoading(false);
    setOpen(false);
  };

  return (
    <AlertDialogRoot open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger variant="danger">Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project</AlertDialogTitle>
          <AlertDialogDescription>
            This project will be deleted, along with all of its Deployments, Domains,
            Environment Variables, Serverless Functions, and Settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            loading={isLoading}
            variant={{ initial: "ghost", sm: "danger" }}
            className="max-sm:text-fg-danger"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
