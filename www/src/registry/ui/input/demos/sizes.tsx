import { Input } from "@/registry/ui/input";

export default function Demo() {
	return (
		<div className="flex w-full flex-col gap-2">
			<Input size="sm" placeholder="Small" />
			<Input size="md" placeholder="Medium" />
			<Input size="lg" placeholder="Large" />
		</div>
	);
}
