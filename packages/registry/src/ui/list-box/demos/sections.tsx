import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/registry/ui/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Burger contents" selectionMode="multiple">
      <ListBoxSection title="Sauces">
        <ListBoxItem id="signature-sauce">Signature sauce</ListBoxItem>
        <ListBoxItem id="bbq-sauce">BBQ sauce</ListBoxItem>
        <ListBoxItem id="honey-mustard">Honey mustard</ListBoxItem>
        <ListBoxItem id="tartar-sauce">Tartar sauce</ListBoxItem>
      </ListBoxSection>
      <ListBoxSection title="Cheese">
        <ListBoxItem id="pepperjack">Pepperjack</ListBoxItem>
        <ListBoxItem id="mozzarella">Mozzarella</ListBoxItem>
        <ListBoxItem id="blue-cheese">Blue cheese</ListBoxItem>
      </ListBoxSection>
      <ListBoxSection title="Extras">
        <ListBoxItem id="bacon">Bacon</ListBoxItem>
        <ListBoxItem id="sauteed-onions">Sauteed onions</ListBoxItem>
        <ListBoxItem id="green-pepper">Green pepper</ListBoxItem>
      </ListBoxSection>
    </ListBox>
  );
}
