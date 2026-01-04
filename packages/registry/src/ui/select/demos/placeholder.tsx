import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@dotui/registry/ui/select";

export default function Demo() {
	return (
		<Select aria-label="Provider" placeholder="Select a provider">
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem>Perplexity</SelectItem>
				<SelectItem>Replicate</SelectItem>
				<SelectItem>Together AI</SelectItem>
				<SelectItem>ElevenLabs</SelectItem>
			</SelectContent>
		</Select>
	);
}
