import { Avatar } from "@dotui/registry/ui/avatar";

export default function Demo() {
	return (
		<div className="space-x-4">
			<Avatar src="https://github.com/mehdibha.png" alt="@mehdibha" fallback="M" />
			<Avatar src="https://github.com/mehdibha.png" alt="@mehdibha" fallback="M" />
		</div>
	);
}
