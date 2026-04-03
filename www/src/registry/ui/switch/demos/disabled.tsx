import { Label } from "@/registry/ui/field";
import { Switch, SwitchIndicator } from "@/registry/ui/switch";

export default function Demo() {
	return (
		<div className="flex items-center gap-10">
			<Switch isDisabled defaultSelected>
				<SwitchIndicator />
				<Label>Focus Mode</Label>
			</Switch>
			<Switch isDisabled>
				<SwitchIndicator />
				<Label>Focus Mode</Label>
			</Switch>
		</div>
	);
}
