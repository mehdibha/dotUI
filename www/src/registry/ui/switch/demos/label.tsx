import { Label } from "@/registry/ui/field";
import { Switch, SwitchControl } from "@/registry/ui/switch";

export default function Demo() {
	return (
		<div className="flex items-center gap-10">
			<Switch>
				<SwitchControl />
				<Label>Focus mode</Label>
			</Switch>
			<Switch aria-label="Focus mode" />
		</div>
	);
}
