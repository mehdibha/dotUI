"use client";

import * as React from "react";
import { Button } from "@/lib/components/core/default/button";
import { Textarea } from "@/lib/components/core/default/text-area";
import { ClientOnly } from "@/lib/components/utils/client-only";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

function Demo() {
  const [writing, saveWriting] = useLocalStorage<string | null>("writing", null);
  const [input, setInput] = React.useState(writing ?? "");

  return (
    <div className="w-full max-w-sm">
      <Textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        placeholder="Start your writing here, save it and refresh the page to see it persist."
      />
      <div className="mt-4 flex items-center justify-end space-x-2">
        <Button
          variant="neutral"
          size="sm"
          onClick={() => {
            setInput("");
            saveWriting(null);
          }}
        >
          Clear
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            saveWriting(input);
            // TODO: toast notification
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
