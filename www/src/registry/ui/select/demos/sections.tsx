import { Label } from '@/registry/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectSectionHeader,
  SelectTrigger,
} from '@/registry/ui/select'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <Select className="w-52">
      <Label>Model</Label>
      <SelectTrigger />
      <SelectContent>
        <SelectSection>
          <SelectSectionHeader>OpenAI</SelectSectionHeader>
          <SelectItem>GPT-4o</SelectItem>
          <SelectItem>GPT-4 Turbo</SelectItem>
          <SelectItem>GPT-4</SelectItem>
          <SelectItem>GPT-3.5 Turbo</SelectItem>
        </SelectSection>
        <Separator />
        <SelectSection>
          <SelectSectionHeader>Google</SelectSectionHeader>
          <SelectItem>Gemini 1.5 Flash</SelectItem>
          <SelectItem>Gemini 1.5 Pro</SelectItem>
          <SelectItem>Gemini 1.0 Pro</SelectItem>
        </SelectSection>
        <Separator />
        <SelectSection>
          <SelectSectionHeader>Meta</SelectSectionHeader>
          <SelectItem>Llama 3 (70B)</SelectItem>
          <SelectItem>Llama 3 (8B)</SelectItem>
          <SelectItem>Code Llama (70B)</SelectItem>
        </SelectSection>
        <Separator />
        <SelectSection>
          <SelectSectionHeader>Mistral AI</SelectSectionHeader>
          <SelectItem>Mixtral 8x22B</SelectItem>
          <SelectItem>Mistral Large</SelectItem>
          <SelectItem>Mistral 7B</SelectItem>
        </SelectSection>
      </SelectContent>
    </Select>
  )
}
