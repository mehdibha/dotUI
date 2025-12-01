import {
  Disclosure,
  DisclosureHeading,
  DisclosurePanel,
} from "@dotui/registry/ui/disclosure";

export default function Demo() {
  return (
    <Disclosure defaultExpanded>
      <DisclosureHeading>Expanded by default</DisclosureHeading>
      <DisclosurePanel>
        <p className="pb-3">
          This disclosure is expanded by default when the page loads. Users can
          still collapse it by clicking the heading.
        </p>
      </DisclosurePanel>
    </Disclosure>
  );
}

