import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";

export default function Page() {
  return (
    <div className="h-40 flex items-start">
      <Select aria-label="Provider" defaultOpen>
        <SelectTrigger />
        <SelectContent>
          <SelectItem>Perplexity</SelectItem>
          <SelectItem>Replicate</SelectItem>
          <SelectItem>Together AI</SelectItem>
          <SelectItem>ElevenLabs</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
