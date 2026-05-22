import { Description, Label } from "@/registry/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

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
