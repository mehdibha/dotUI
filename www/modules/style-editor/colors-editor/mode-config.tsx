"use client";

import { ContrastIcon, MoonIcon, SunIcon } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";

import { ThemeModeSwitch } from "@/components/ui/theme-mode-switch";
import { usePreferences } from "@/modules/preferences/preferences-atom";

export const ModeConfig = () => {
	return (
		<Select aria-label="Supported modes" defaultSelectedKey="light-dark" className="w-auto">
			<SelectTrigger />
			<SelectContent>
				<SelectItem id="light">
					<SunIcon />
					Light only
				</SelectItem>
				<SelectItem id="dark">
					<MoonIcon />
					Dark only
				</SelectItem>
				<SelectItem id="light-dark">
					<ContrastIcon />
					Light/Dark
				</SelectItem>
			</SelectContent>
		</Select>
	);
};

export const ModeSwitch = () => {
	const { activeMode, setActiveMode } = usePreferences();

	return (
		<ThemeModeSwitch
			isSelected={activeMode === "light"}
			onChange={(isSelected) => {
				setActiveMode(isSelected ? "light" : "dark");
			}}
		/>
	);
};
