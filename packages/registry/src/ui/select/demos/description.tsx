import { Description, Label } from "@dotui/registry/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";

export default function Demo() {
	return (
		<Select>
			<Label>Provider</Label>
			<SelectTrigger />
			<SelectContent>
				<SelectItem>Perplexity</SelectItem>
				<SelectItem>Replicate</SelectItem>
				<SelectItem>Together AI</SelectItem>
				<SelectItem>ElevenLabs</SelectItem>
			</SelectContent>
			<Description>Please select a provider.</Description>
		</Select>
	);
}
