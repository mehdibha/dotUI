"use client";

import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";

import { AnimatedPreview } from "../animated-preview";

// Combobox opens its list on real focus/typing (which we avoid — it would steal page focus),
// so the autoplay types into the field; hovering the card lets the user open the real list.
export default function Demo() {
	const [inputValue, setInputValue] = useState("");
	return (
		<AnimatedPreview
			contain
			reset={() => setInputValue("")}
			script={async (s) => {
				await s.wait(600);
				await s.type("field", "France", setInputValue);
				await s.wait(1600);
				await s.moveOff();
				await s.wait(700);
			}}
		>
			{(ref) => (
				<div ref={ref("field")} className="w-52">
					<Combobox aria-label="Country" inputValue={inputValue} onInputChange={setInputValue}>
						<InputGroup>
							<Input placeholder="Select a country..." />
							<InputGroupAddon>
								<Button variant="quiet" isIconOnly>
									<ChevronDownIcon />
								</Button>
							</InputGroupAddon>
						</InputGroup>
						<Popover>
							<ListBox>
								<ListBoxItem id="ca">Canada</ListBoxItem>
								<ListBoxItem id="fr">France</ListBoxItem>
								<ListBoxItem id="de">Germany</ListBoxItem>
							</ListBox>
						</Popover>
					</Combobox>
				</div>
			)}
		</AnimatedPreview>
	);
}
