import { monoFonts, sansSerifFonts, serifFonts } from "@/registry/base/fonts";
import { Command } from "@/registry/ui/command";
import { Label } from "@/registry/ui/field";
import { Input } from "@/registry/ui/input";
import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { SearchField } from "@/registry/ui/search-field";
import { Select, SelectTrigger } from "@/registry/ui/select";

/** Direct font dropdowns — used inline on the customizer home. */
export function TypographyControls() {
	return (
		<div className="flex flex-col gap-3">
			<FontPicker label="Heading font" />
			<FontPicker label="Body font" />
		</div>
	);
}

/** Full typography panel reached from the Typography "Customize" link. */
export function TypographyConfig() {
	return (
		<div className="-mt-6 flex flex-col gap-4">
			<p className="text-xs text-fg-muted">Pick the heading and body typefaces — applied live across the preview.</p>
			<TypographyControls />
		</div>
	);
}

const FontPicker = ({ label }: { label: string }) => {
	return (
		<Select className="w-full" defaultSelectedKey="Geist">
			<Label>{label}</Label>
			<SelectTrigger className="w-full" />
			<Popover>
				<Command>
					<SearchField autoFocus className="w-full p-2">
						<Input className="w-full" />
					</SearchField>
					<ListBox>
						<ListBoxSection>
							<ListBoxSectionHeader>Serif</ListBoxSectionHeader>
							{serifFonts.map((font) => (
								<ListBoxItem key={font} id={font}>
									{font}
								</ListBoxItem>
							))}
						</ListBoxSection>
						<ListBoxSection>
							<ListBoxSectionHeader>Sans Serif</ListBoxSectionHeader>
							{sansSerifFonts.map((font) => (
								<ListBoxItem key={font} id={font}>
									{font}
								</ListBoxItem>
							))}
						</ListBoxSection>
						<ListBoxSection>
							<ListBoxSectionHeader>Mono</ListBoxSectionHeader>
							{monoFonts.map((font) => (
								<ListBoxItem key={font} id={font}>
									{font}
								</ListBoxItem>
							))}
						</ListBoxSection>
					</ListBox>
				</Command>
			</Popover>
		</Select>
	);
};
