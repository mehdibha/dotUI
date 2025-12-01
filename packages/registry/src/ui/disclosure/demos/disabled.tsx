import {
  Disclosure,
  DisclosureHeading,
  DisclosurePanel,
} from "@dotui/registry/ui/disclosure";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Disclosure isDisabled>
        <DisclosureHeading>Disabled disclosure</DisclosureHeading>
        <DisclosurePanel>
          <p className="pb-3">This content cannot be revealed.</p>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure isDisabled defaultExpanded>
        <DisclosureHeading>Disabled (expanded)</DisclosureHeading>
        <DisclosurePanel>
          <p className="pb-3">
            This content is visible but the disclosure cannot be collapsed.
          </p>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}

