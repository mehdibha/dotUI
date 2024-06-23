import { ListBox, ListBoxItem } from "@/lib/components/core/default/list-box";

export default function Demo() {
  return (
    <ListBox aria-label="Links">
      <ListBoxItem href="https://github.com/mehdibha" target="_blank">
        GitHub
      </ListBoxItem>
      <ListBoxItem href="https://linkedin.com/in/mehdibha" target="_blank">
        LinkedIn
      </ListBoxItem>
      <ListBoxItem href="https://x.com/mehdibha_" target="_blank">
        X
      </ListBoxItem>
    </ListBox>
  );
}
