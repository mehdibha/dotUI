import { Label } from "@dotui/registry/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSection,
  SelectSectionHeader,
  SelectTrigger,
} from "@dotui/registry/ui/select";

export default function Demo() {
  return (
    <Select>
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
        <SelectSection>
          <SelectSectionHeader>Google</SelectSectionHeader>
          <SelectItem>Gemini 1.5 Flash</SelectItem>
          <SelectItem>Gemini 1.5 Pro</SelectItem>
          <SelectItem>Gemini 1.0 Pro</SelectItem>
        </SelectSection>
        <SelectSection>
          <SelectSectionHeader>Meta</SelectSectionHeader>
          <SelectItem>Llama 3 (70B)</SelectItem>
          <SelectItem>Llama 3 (8B)</SelectItem>
          <SelectItem>Code Llama (70B)</SelectItem>
        </SelectSection>
        <SelectSection>
          <SelectSectionHeader>Mistral AI</SelectSectionHeader>
          <SelectItem>Mixtral 8x22B</SelectItem>
          <SelectItem>Mistral Large</SelectItem>
          <SelectItem>Mistral 7B</SelectItem>
        </SelectSection>
      </SelectContent>
    </Select>
  );
}
