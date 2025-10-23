"use client";

import { TextArea } from "@dotui/registry/ui/text-area";

export default function Demo() {
  return (
    <TextArea
      label="Comment"
      isInvalid
      errorMessage="You have exceeded the comment limit for one hour."
    />
  );
}
