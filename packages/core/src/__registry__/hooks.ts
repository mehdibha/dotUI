// AUTO-GENERATED - DO NOT EDIT
// Run "pnpm build" to regenerate

export const hooks = [
	{
		name: "use-mobile",
		type: "registry:hook",
		files: [
			{
				type: "registry:hook",
				path: "hooks/use-mobile.ts",
				target: "hooks/use-mobile.ts",
				content: `import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

	React.useEffect(() => {
		const mql = window.matchMedia(\`(max-width: \${MOBILE_BREAKPOINT - 1}px)\`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
}
`,
			},
		],
	},
] as const;
