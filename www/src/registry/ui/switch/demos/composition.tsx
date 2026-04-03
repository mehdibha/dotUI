import { Label } from "@/registry/ui/field";
import { Switch, SwitchIndicator, SwitchThumb } from "@/registry/ui/switch";

export default function Demo() {
	return (
		<Switch>
			<SwitchIndicator>
				<SwitchThumb />
			</SwitchIndicator>
			<Label>Focus mode</Label>
		</Switch>
	);
}
