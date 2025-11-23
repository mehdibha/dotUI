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
  const trimmedLabel =
    typeof label === "string" ? label.trim() : (label ?? undefined);
  const trimmedPlaceholder =
    typeof placeholder === "string" ? placeholder.trim() : undefined;

  return (
    <Select
      aria-label={trimmedLabel ? undefined : "Provider"}
      placeholder={trimmedPlaceholder || undefined}
      isDisabled={isDisabled}
    >
      {trimmedLabel ? <Label>{trimmedLabel}</Label> : null}
      <SelectTrigger />
      <SelectContent
        selectionMode={selectionMode === "multiple" ? "multiple" : undefined}
      >
        <SelectItem>Perplexity</SelectItem>
        <SelectItem>Replicate</SelectItem>
        <SelectItem>Together AI</SelectItem>
        <SelectItem>ElevenLabs</SelectItem>
      </SelectContent>
    </Select>
  );
}
