"use client"
 
import {
  ComboboxRoot,
  ComboboxCollection,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxListBox,
  ComboboxPopover,
  ComboboxSection,
} from "@/lib/components/core/default/combobox"
 
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]
 
export default function ComboboxDemo() {
  return (
    <ComboboxRoot aria-label="Select Framework">
      <ComboboxInput
        className="w-[200px]"
        placeholder="Select a framework..."
      />
      <ComboboxPopover>
        <ComboboxListBox>
          <ComboboxSection>
            <ComboboxLabel separator>Frameworks</ComboboxLabel>
            <ComboboxCollection items={frameworks}>
              {(item) => (
                <ComboboxItem
                  textValue={item.label}
                  id={item.value}
                  key={item.value}
                >
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxCollection>
          </ComboboxSection>
        </ComboboxListBox>
      </ComboboxPopover>
    </ComboboxRoot>
  )
}