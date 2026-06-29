import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

export default function Demo() {
  return (
    <Select
      className="max-w-xs"
      aria-label="Provider"
      defaultSelectedKey="eleven-labs"
    >
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="perplexity">Perplexity</SelectItem>
        <SelectItem id="replicate">Replicate</SelectItem>
        <SelectItem id="together-ai">Together AI</SelectItem>
        <SelectItem id="eleven-labs">ElevenLabs</SelectItem>
      </SelectContent>
    </Select>
  )
}
