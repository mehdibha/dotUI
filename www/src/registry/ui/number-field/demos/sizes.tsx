import { Group } from "@/registry/ui/group";
import { Input } from "@/registry/ui/input";
import { NumberField, NumberFieldDecrement, NumberFieldIncrement } from "@/registry/ui/number-field";

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			<NumberField aria-label="small (sm)" defaultValue={1024}>
				<Group>
					<NumberFieldDecrement size="sm" />
					<Input placeholder="small (sm)" size="sm" />
					<NumberFieldIncrement size="sm" />
				</Group>
			</NumberField>
			<NumberField aria-label="medium (md)" defaultValue={1024}>
				<Group>
					<NumberFieldDecrement/>
					<Input placeholder="medium (md)" />
					<NumberFieldIncrement/>
				</Group>
			</NumberField>
			<NumberField aria-label="large (lg)" defaultValue={1024}>
				<Group>
					<NumberFieldDecrement size="lg" />
					<Input placeholder="large (lg)" size="lg" />
					<NumberFieldIncrement size="lg" />
				</Group>
			</NumberField>
		</div>
	);
}
