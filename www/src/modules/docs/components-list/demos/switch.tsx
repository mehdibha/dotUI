import { Label } from "@/registry/ui/field";
import { Switch, SwitchIndicator } from "@/registry/ui/switch";

export function SwitchDemo() {
	return (
		<Switch>
			<SwitchIndicator />
			<Label>Focus mode</Label>
		</Switch>
	);
}
