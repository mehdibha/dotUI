"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { toast } from "@dotui/registry-v2/ui/toast";

export function ToastDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onPress={() => {
          toast.add({
            title: "Success!",
            description: "Your changes have been saved.",
            variant: "success",
          });
        }}
      >
        Success Toast
      </Button>

      <Button
        onPress={() => {
          toast.add({
            title: "Error occurred",
            description: "Please try again later.",
            variant: "error",
          });
        }}
      >
        Error Toast
      </Button>

      <Button
        onPress={() => {
          toast.add({
            title: "Warning",
            description: "This action cannot be undone.",
            variant: "warning",
          });
        }}
      >
        Warning Toast
      </Button>

      <Button
        onPress={() => {
          toast.add({
            title: "Information",
            description: "New updates are available.",
            variant: "info",
          });
        }}
      >
        Info Toast
      </Button>

      <Button
        onPress={() => {
          toast.add({
            title: "Notification",
            description: "You have 3 new messages.",
            variant: "neutral",
          });
        }}
      >
        Neutral Toast
      </Button>

      <Button
        onPress={() => {
          toast.add({
            title: "Simple toast",
          });
        }}
      >
        No Description
      </Button>
    </div>
  );
}
