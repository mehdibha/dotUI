import {
  Disclosure,
  DisclosureTrigger,
  DisclosurePanel,
} from "@dotui/registry/ui/disclosure";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <Disclosure isDisabled>
        <DisclosureTrigger>Disabled disclosure</DisclosureTrigger>
        <DisclosurePanel>
          <p className="pb-3">This content cannot be revealed.</p>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure isDisabled defaultExpanded>
        <DisclosureTrigger>Disabled (expanded)</DisclosureTrigger>
        <DisclosurePanel>
          <p className="pb-3">
            This content is visible but the disclosure cannot be collapsed.
          </p>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}

