import React from "react";

import { TextArea } from "@dotui/ui/components/text-area";

export default function Demo() {
  return (
    <TextArea
      isRequired
      label="Description"
      placeholder="Type your message here"
    />
  );
}
