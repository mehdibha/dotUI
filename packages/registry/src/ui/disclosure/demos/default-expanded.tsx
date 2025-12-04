import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@dotui/registry/ui/disclosure";

export default function Demo() {
  return (
    <Disclosure defaultExpanded className="max-w-xs">
      <DisclosureTrigger>Expanded by default</DisclosureTrigger>
      <DisclosurePanel>
        <p className="pb-3">
          This disclosure is expanded by default when the page loads. Users can
          still collapse it by clicking the heading.
        </p>
      </DisclosurePanel>
    </Disclosure>
  );
}
