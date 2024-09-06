"use client";

import * as React from "react";
import { ClientOnly } from "@/lib/components/utils/client-only";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { Button } from "@/registry/ui/default/core/button";
import { TextArea } from "@/registry/ui/default/core/text-area";

function Demo() {
  const [writing, saveWriting] = useLocalStorage<string | null>(
    "writing",
    null
  );
  const [input, setInput] = React.useState(writing ?? "");

  return (
    <div className="w-full max-w-sm">
      <TextArea
        value={input}
        onChange={(value) => {
          setInput(value);
        }}
        placeholder="Start your writing here, save it and refresh the page to see it persist."
      />
      <div className="mt-4 flex items-center justify-end space-x-2">
        <Button
          size="sm"
          onPress={() => {
            setInput("");
            saveWriting(null);
          }}
        >
          Clear
        </Button>
        <Button
          variant="primary"
          size="sm"
          onPress={() => {
            saveWriting(input);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default function ClientOnlyDemo() {
  return (
    <ClientOnly>
      <Demo />
    </ClientOnly>
  );
}
