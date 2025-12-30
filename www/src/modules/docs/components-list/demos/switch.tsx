import { Label } from "@dotui/registry/ui/field";
import { Switch, SwitchIndicator } from "@dotui/registry/ui/switch";

export function SwitchDemo() {
	return (
		<Switch>
			<SwitchIndicator />
			<Label>Focus mode</Label>
		</Switch>
	);
}
