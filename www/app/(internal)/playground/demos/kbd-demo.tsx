"use client";

import { Kbd } from "@dotui/registry-v2/ui/kbd";

export function KbdDemo() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex flex-wrap gap-4">
        <Kbd>⌘</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>Ctrl</Kbd>
        <Kbd>Alt</Kbd>
        <Kbd>Tab</Kbd>
        <Kbd>Enter</Kbd>
        <Kbd>Esc</Kbd>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-1">
          <Kbd>⌘</Kbd>
          <span className="text-sm">+</span>
          <Kbd>K</Kbd>
        </div>
        <div className="flex items-center gap-1">
          <Kbd>Ctrl</Kbd>
          <span className="text-sm">+</span>
          <Kbd>C</Kbd>
        </div>
        <div className="flex items-center gap-1">
          <Kbd>Shift</Kbd>
          <span className="text-sm">+</span>
          <Kbd>Alt</Kbd>
          <span className="text-sm">+</span>
          <Kbd>F</Kbd>
        </div>
      </div>
      <p className="text-sm">
        Press{" "}
        <Kbd.Group>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </Kbd.Group>{" "}
        to open the command palette
      </p>
      <p className="text-sm">
        Use{" "}
        <Kbd.Group>
          <Kbd>Ctrl</Kbd>
          <Kbd>S</Kbd>
        </Kbd.Group>
        to save your work
      </p>
    </div>
  );
}
