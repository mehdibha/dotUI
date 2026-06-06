import { Label } from "@/registry/ui/field";
import { ProgressBar, ProgressBarControl, ProgressBarFill } from "@/registry/ui/progress-bar";

const variants = [
	{
		label: "primary",
		className: "bg-primary",
	},
	{
		label: "success",
		className: "bg-success",
	},
	{
		label: "accent",
		className: "bg-accent",
	},
	{
		label: "danger",
		className: "bg-danger",
	},
	{
		label: "warning",
		className: "bg-warning",
	},
] as const;

export default function Demo() {
	return (
		<div className="w-full space-y-4">
			{variants.map((variant) => (
				<ProgressBar key={variant.label} value={75}>
					<Label>{variant.label}</Label>
					<ProgressBarControl>
						<ProgressBarFill className={variant.className} />
					</ProgressBarControl>
				</ProgressBar>
			))}
		</div>
	);
}
