import { Label } from "@/registry/ui/field"
import {
  ListBoxItemDescription,
  ListBoxItemLabel,
} from "@/registry/ui/list-box"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"

const OPTIONS = [
  {
    id: "all",
    label: "All activity",
    description: "Every comment, edit and mention.",
  },
  {
    id: "mentions",
    label: "Mentions & replies",
    description: "Only when someone needs you.",
  },
  {
    id: "digest",
    label: "Daily digest",
    description: "One summary every morning.",
  },
  { id: "off", label: "Nothing", description: "Check in on your own time." },
]

export function SelectScene() {
  return (
    <Select defaultValue="mentions" className="w-full max-w-72">
      <Label>Notify me about</Label>
      <SelectTrigger />
      <SelectContent>
        {OPTIONS.map((option) => (
          <SelectItem key={option.id} id={option.id} textValue={option.label}>
            <ListBoxItemLabel>{option.label}</ListBoxItemLabel>
            <ListBoxItemDescription>
              {option.description}
            </ListBoxItemDescription>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
