import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

export default function Demo() {
  return (
    <Select className="w-52" aria-label="Provider" isDisabled>
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
