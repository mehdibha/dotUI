import { Description, FieldContent, FieldGroup, Label } from "@/registry/ui/field";
import { Radio, RadioControl, RadioGroup, RadioIndicator } from "@/registry/ui/radio-group";

export default function Demo() {
	return (
		<RadioGroup defaultValue="nextjs" className="w-full max-w-xs">
			<Label>React frameworks</Label>
			<FieldGroup>
				<Radio value="nextjs">
					<RadioControl>
						<RadioIndicator />
						<FieldContent>
							<Label>Next.js</Label>
							<Description>The React framework for the web</Description>
						</FieldContent>
					</RadioControl>
				</Radio>
				<Radio value="remix">
					<RadioControl>
						<RadioIndicator />
						<FieldContent>
							<Label>Remix</Label>
							<Description>Full stack web framework</Description>
						</FieldContent>
					</RadioControl>
				</Radio>
				<Radio value="gatsby">
					<RadioControl>
						<RadioIndicator />
						<FieldContent>
							<Label>Gatsby</Label>
							<Description>Build fast, modern websites</Description>
						</FieldContent>
					</RadioControl>
				</Radio>
			</FieldGroup>
		</RadioGroup>
	);
}
