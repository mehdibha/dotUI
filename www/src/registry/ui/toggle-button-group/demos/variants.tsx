import { BoldIcon, ItalicIcon, UnderlineIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

const variants = ["default", "primary", "quiet"] as const;

export default function Demo() {
	return (
		<>
			{variants.map((variant) => (
				<ToggleButtonGroup key={variant} variant={variant} aria-label={`${variant} text formatting`}>
					<ToggleButton id={`${variant}-bold`} isIconOnly aria-label="Bold">
						<BoldIcon />
					</ToggleButton>
					<ToggleButton id={`${variant}-italic`} isIconOnly aria-label="Italic">
						<ItalicIcon />
					</ToggleButton>
					<ToggleButton id={`${variant}-underline`} isIconOnly aria-label="Underline">
						<UnderlineIcon />
					</ToggleButton>
				</ToggleButtonGroup>
			))}
		</>
	);
}
