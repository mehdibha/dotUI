import { FieldError, Label } from "@/registry/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

export default function Demo() {
	return (
		<Select isInvalid>
			<Label>Provider</Label>
			<SelectTrigger />
			<SelectContent>
				<SelectItem>Perplexity</SelectItem>
				<SelectItem>Replicate</SelectItem>
				<SelectItem>Together AI</SelectItem>
				<SelectItem>ElevenLabs</SelectItem>
			</SelectContent>
			<FieldError>Please select an item in the list.</FieldError>
		</Select>
	);
}
