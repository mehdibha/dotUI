import {
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@dotui/registry/ui/disclosure";

export default function Demo() {
  return (
    <Disclosure isDisabled className="max-w-xs">
      <DisclosureTrigger>Disabled disclosure</DisclosureTrigger>
      <DisclosurePanel>This content cannot be revealed</DisclosurePanel>
    </Disclosure>
  );
}
