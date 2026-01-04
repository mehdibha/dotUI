import { Switch, SwitchIndicator } from "@dotui/registry/ui/switch";

export default function Demo() {
	return (
		<div className="flex items-center gap-4">
			<Switch size="sm" defaultSelected>
				<SwitchIndicator />
			</Switch>
			<Switch size="md" defaultSelected>
				<SwitchIndicator />
			</Switch>
			<Switch size="lg" defaultSelected>
				<SwitchIndicator />
			</Switch>
		</div>
	);
}
