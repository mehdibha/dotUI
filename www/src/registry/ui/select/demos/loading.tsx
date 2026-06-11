import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

export default function Demo() {
  return (
    <Select aria-label="Provider">
      <SelectTrigger />
      <SelectContent isLoading>
        <SelectItem>Perplexity</SelectItem>
        <SelectItem>Replicate</SelectItem>
        <SelectItem>Together AI</SelectItem>
        <SelectItem>ElevenLabs</SelectItem>
      </SelectContent>
    </Select>
  )
}
