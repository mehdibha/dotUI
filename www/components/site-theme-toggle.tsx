import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button, type ButtonProps } from "@dotui/registry/ui/button";

export const SiteThemeToggle = (props: ButtonProps) => {
	const { resolvedTheme, setTheme } = useTheme();
	return (
		<Button aria-label="Toggle theme" {...props} onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
			<SunIcon className="block dark:hidden" />
			<MoonIcon className="hidden dark:block" />
		</Button>
	);
};
