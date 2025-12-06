import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@dotui/registry/ui/disclosure";

export default function Demo() {
  return (
    <Disclosure className="max-w-xs">
      <DisclosureTrigger>System requirements</DisclosureTrigger>
      <DisclosurePanel>
        Details about system requirements go here. Describes the minimum and
        recommended hardware and software needed.
      </DisclosurePanel>
    </Disclosure>
  );
}
