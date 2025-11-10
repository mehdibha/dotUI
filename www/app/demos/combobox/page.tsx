"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { useInView } from "motion/react";

import { Button } from "@dotui/registry/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
} from "@dotui/registry/ui/combobox";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";

export default function Page() {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { initial: false, once: false });

  React.useEffect(() => {
    console.log("inView", inView);
    let timeout: NodeJS.Timeout;
    if (inView && buttonRef.current) {
      timeout = setTimeout(() => {
        console.log("clicking");
        buttonRef.current?.click();
      }, 500);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [inView]);

  return (
    <div ref={containerRef} className="h-42 flex items-start">
      <Combobox aria-label="Country" menuTrigger="focus">
        <InputGroup>
          <Input placeholder="Select country..." />
          <InputAddon>
            <Button ref={buttonRef} variant="quiet">
              <ChevronDownIcon />
            </Button>
          </InputAddon>
        </InputGroup>
        <ComboboxContent isOpen className="h-30">
          <ComboboxItem>Canada</ComboboxItem>
          <ComboboxItem>France</ComboboxItem>
          <ComboboxItem>Germany</ComboboxItem>
          <ComboboxItem>Japan</ComboboxItem>
          <ComboboxItem>United Kingdom</ComboboxItem>
          <ComboboxItem>United States</ComboboxItem>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
