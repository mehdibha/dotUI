import { Label } from "@dotui/registry/ui/field";
import { Switch, SwitchIndicator } from "@dotui/registry/ui/switch";

export default function Demo() {
	return (
		<div className="flex items-center gap-10">
			<Switch>
				<SwitchIndicator />
				<Label>Focus mode</Label>
			</Switch>
			<Switch aria-label="Focus mode">
				<SwitchIndicator />
			</Switch>
		</div>
	);
}
