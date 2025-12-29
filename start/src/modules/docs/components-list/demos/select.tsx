import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";

export function SelectDemo() {
	return (
		<div className="flex h-40 items-start">
			<Select aria-label="Provider">
				<SelectTrigger />
				<SelectContent className="h-30">
					<SelectItem>Perplexity</SelectItem>
					<SelectItem>Replicate</SelectItem>
					<SelectItem>Together AI</SelectItem>
					<SelectItem>ElevenLabs</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
