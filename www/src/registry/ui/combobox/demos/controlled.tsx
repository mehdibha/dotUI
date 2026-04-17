"use client";

import React from "react";
import type * as MenuPrimitives from "react-aria-components/Menu";

import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem } from "@/registry/ui/combobox";

export default function Demo() {
	const [country, setCountry] = React.useState<MenuPrimitives.Key | null>("tn");
	return (
		<div className="flex flex-col items-center gap-6">
			<Combobox aria-label="country" selectedKey={country} onSelectionChange={setCountry}>
				<ComboboxInput />
				<ComboboxContent>
					<ComboboxItem id="ca">Canada</ComboboxItem>
					<ComboboxItem id="fr">France</ComboboxItem>
					<ComboboxItem id="de">Germany</ComboboxItem>
					<ComboboxItem id="es">Spain</ComboboxItem>
					<ComboboxItem id="tn">Tunisia</ComboboxItem>
					<ComboboxItem id="us">United States</ComboboxItem>
					<ComboboxItem id="uk">United Kingdom</ComboboxItem>
				</ComboboxContent>
			</Combobox>
			<p className="text-fg-muted text-sm">
				{country ? (
					<>
						You selected: <span className="font-bold text-fg">{country}</span>
					</>
				) : (
					"Select a country."
				)}
			</p>
		</div>
	);
}
