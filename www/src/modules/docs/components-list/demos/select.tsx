import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

export function SelectDemo() {
  return (
    <Select aria-label="Provider" className="w-48">
      <SelectTrigger />
      <SelectContent>
        <SelectItem>Perplexity</SelectItem>
        <SelectItem>Replicate</SelectItem>
        <SelectItem>Together AI</SelectItem>
        <SelectItem>ElevenLabs</SelectItem>
      </SelectContent>
    </Select>
  )
}
