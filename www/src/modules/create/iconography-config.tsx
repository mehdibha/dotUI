import { FieldGroup, Label } from "@dotui/registry/ui/field";
import { Radio, RadioGroup, RadioIndicator } from "@dotui/registry/ui/radio-group";

const iconLibraries = [
	{ name: "Lucide", value: "lucide", description: "Clean & consistent" },
	{ name: "Remix Icons", value: "remix", description: "Neutral & versatile" },
	{ name: "Tabler Icons", value: "tabler", description: "Over 5000 icons" },
	{ name: "Huge Icons", value: "hugeicons", description: "Modern & bold" },
];

export function IconographyConfig() {
	return (
		<div>
			<RadioGroup aria-label="icon library" defaultValue="lucide">
				<FieldGroup className="gap-1 **:data-radio:border">
					{iconLibraries.map((lib) => (
						<Radio
							key={lib.value}
							value={lib.value}
							className="justify-between rounded-lg border selected:border-border-control selected:bg-neutral-hover/80 p-4 selected:text-fg hover:bg-neutral"
						>
							<Label className="text-fg!">{lib.name}</Label>
							<RadioIndicator />
						</Radio>
					))}
				</FieldGroup>
			</RadioGroup>
		</div>
	);
}
