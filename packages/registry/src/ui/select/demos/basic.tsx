import { Label } from "@dotui/registry/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";

interface DemoProps {
  label?: string;
  placeholder?: string;
  selectionMode?: "single" | "multiple";
  isDisabled?: boolean;
}

export default function Demo({
  label,
  placeholder,
  selectionMode = "single",
  isDisabled = false,
}: DemoProps = {}) {
  const trimmedLabel = label?.trim();
  const trimmedPlaceholder = placeholder?.trim();

  return (
    <Select
      aria-label={trimmedLabel ? undefined : "Provider"}
      placeholder={trimmedPlaceholder || undefined}
      selectionMode={selectionMode}
      isDisabled={isDisabled}
    >
      {trimmedLabel ? <Label>{trimmedLabel}</Label> : null}
      <SelectTrigger />
      <SelectContent>
        <SelectItem>Perplexity</SelectItem>
        <SelectItem>Replicate</SelectItem>
        <SelectItem>Together AI</SelectItem>
        <SelectItem>ElevenLabs</SelectItem>
      </SelectContent>
    </Select>
  );
}
