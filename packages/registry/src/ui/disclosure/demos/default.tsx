import {
  Disclosure,
  DisclosureHeading,
  DisclosurePanel,
} from "@dotui/registry/ui/disclosure";

export default function Demo() {
  return (
    <Disclosure>
      <DisclosureHeading>System requirements</DisclosureHeading>
      <DisclosurePanel>
        <p className="pb-3">
          Details about system requirements go here. Describes the minimum and
          recommended hardware and software needed.
        </p>
      </DisclosurePanel>
    </Disclosure>
  );
}

