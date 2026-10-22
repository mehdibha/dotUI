import { SearchIcon } from "@/registry/icons"
import { Command } from "@/registry/ui/command"
import { Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Select, SelectTrigger } from "@/registry/ui/select"

const REGIONS = [
  {
    name: "Africa",
    countries: [
      ["🇩🇿", "Algeria"],
      ["🇪🇬", "Egypt"],
      ["🇰🇪", "Kenya"],
      ["🇲🇦", "Morocco"],
      ["🇳🇬", "Nigeria"],
      ["🇹🇳", "Tunisia"],
    ],
  },
  {
    name: "Americas",
    countries: [
      ["🇦🇷", "Argentina"],
      ["🇧🇷", "Brazil"],
      ["🇨🇦", "Canada"],
      ["🇲🇽", "Mexico"],
      ["🇺🇸", "United States"],
    ],
  },
  {
    name: "Asia",
    countries: [
      ["🇮🇳", "India"],
      ["🇯🇵", "Japan"],
      ["🇸🇬", "Singapore"],
      ["🇰🇷", "South Korea"],
      ["🇦🇪", "United Arab Emirates"],
    ],
  },
  {
    name: "Europe",
    countries: [
      ["🇫🇷", "France"],
      ["🇩🇪", "Germany"],
      ["🇮🇹", "Italy"],
      ["🇳🇱", "Netherlands"],
      ["🇪🇸", "Spain"],
      ["🇬🇧", "United Kingdom"],
    ],
  },
]

export function SearchableSelectScene() {
  return (
    <Select
      defaultValue="Japan"
      placeholder="Select a country"
      className="w-full max-w-72"
    >
      <Label>Country</Label>
      <SelectTrigger />
      <Popover className="outline-hidden">
        <Command>
          <SearchField aria-label="Search countries">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Search…" />
            </InputGroup>
          </SearchField>
          <ListBox>
            {REGIONS.map((region) => (
              <ListBoxSection key={region.name}>
                <ListBoxSectionHeader>{region.name}</ListBoxSectionHeader>
                {region.countries.map(([flag, name]) => (
                  <ListBoxItem key={name} id={name} textValue={name}>
                    <span aria-hidden>{flag}</span>
                    {name}
                  </ListBoxItem>
                ))}
              </ListBoxSection>
            ))}
          </ListBox>
        </Command>
      </Popover>
    </Select>
  )
}
