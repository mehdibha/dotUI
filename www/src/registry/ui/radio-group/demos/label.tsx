import { FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group";

export default function Demo() {
	return (
		<div className="flex items-start gap-10">
			<RadioGroup defaultValue="nextjs">
				<Label>React frameworks</Label>
				<FieldGroup>
					<Radio value="nextjs">
						<RadioControl />
						<Label>Next.js</Label>
					</Radio>
					<Radio value="remix">
						<RadioControl />
						<Label>Remix</Label>
					</Radio>
				</FieldGroup>
			</RadioGroup>
			<RadioGroup defaultValue="nextjs" aria-label="React frameworks">
				<FieldGroup>
					<Radio value="nextjs">
						<RadioControl />
						<Label>Next.js</Label>
					</Radio>
					<Radio value="remix">
						<RadioControl />
						<Label>Remix</Label>
					</Radio>
				</FieldGroup>
			</RadioGroup>
		</div>
	);
}
