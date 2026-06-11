import { Label } from '@/registry/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

export default function Demo() {
  return (
    <Select placeholder="Pick one…">
      <Label>Framework</Label>
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="next">Next.js</SelectItem>
        <SelectItem id="remix">Remix</SelectItem>
        <SelectItem id="astro">Astro</SelectItem>
        <SelectItem id="gatsby">Gatsby</SelectItem>
      </SelectContent>
    </Select>
  )
}
