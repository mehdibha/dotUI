"use client";

import {
  Button as AriaButton,
  DialogTrigger,
  Heading,
} from "react-aria-components";

import { Button } from "@dotui/registry-v2/ui/button";
import { Popover } from "@dotui/registry-v2/ui/popover";

export function PopoverDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <DialogTrigger>
        <Button>Open Popover</Button>
        <Popover>
          <div className="p-4">
            <Heading className="mb-2 text-sm font-medium">
              Popover Title
            </Heading>
            <p className="text-sm text-fg-muted">
              This is a simple popover with some content.
            </p>
          </div>
        </Popover>
      </DialogTrigger>

      <DialogTrigger>
        <Button>With Arrow</Button>
        <Popover showArrow>
          <div className="p-4">
            <p className="text-sm">
              This popover has an arrow pointing to the trigger.
            </p>
          </div>
        </Popover>
      </DialogTrigger>

      <DialogTrigger>
        <Button>Rich Content</Button>
        <Popover>
          <div className="w-80 p-4">
            <Heading className="mb-3 text-base font-semibold">
              Account Settings
            </Heading>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-fg-muted">Name:</span>
                <span>John Doe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Email:</span>
                <span>john@example.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-muted">Plan:</span>
                <span>Pro</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <AriaButton className="flex-1 rounded-md bg-primary px-3 py-1.5 text-sm text-fg-on-primary">
                Edit
              </AriaButton>
              <AriaButton className="flex-1 rounded-md border px-3 py-1.5 text-sm">
                Cancel
              </AriaButton>
            </div>
          </div>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
