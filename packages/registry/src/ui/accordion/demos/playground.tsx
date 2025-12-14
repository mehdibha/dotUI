"use client";

import { Accordion } from "@dotui/registry/ui/accordion";
import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@dotui/registry/ui/disclosure";

interface AccordionPlaygroundProps {
  allowsMultipleExpanded?: boolean;
  isDisabled?: boolean;
}

export function AccordionPlayground({
  allowsMultipleExpanded = false,
  isDisabled = false,
}: AccordionPlaygroundProps) {
  return (
    <Accordion
      allowsMultipleExpanded={allowsMultipleExpanded}
      isDisabled={isDisabled}
      className="w-full max-w-2xl"
    >
      <Disclosure id="getting-started">
        <DisclosureTrigger>How do I get started with DotUI?</DisclosureTrigger>
        <DisclosurePanel>
          Getting started is simple! Install the package using your preferred
          package manager, then import the components you need.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure id="free-to-use">
        <DisclosureTrigger>Is DotUI free to use?</DisclosureTrigger>
        <DisclosurePanel>
          Yes, DotUI is completely free and open source. You can use it in any
          project, whether personal or commercial.
        </DisclosurePanel>
      </Disclosure>
      <Disclosure id="customization">
        <DisclosureTrigger>Can I customize the components?</DisclosureTrigger>
        <DisclosurePanel>
          Absolutely! All components use Tailwind Variants for styling, making
          it easy to customize colors, sizes, and other visual properties.
        </DisclosurePanel>
      </Disclosure>
    </Accordion>
  );
}
