import type { RegistryItem } from "@dotui/registry/types";

const loginMeta: RegistryItem = {
	name: "login",
	description: "A simple login form.",
	type: "registry:block",
	dependencies: ["@internationalized/date"],
	registryDependencies: ["button", "text-field", "card", "link"],
	files: [
		{
			path: "blocks/auth/login/page.tsx",
			target: "app/login/page.tsx",
			type: "registry:page",
		},
		{
			path: "blocks/auth/login/components/login-form.tsx",
			type: "registry:component",
		},
	],
	categories: ["featured", "authentication"],
	meta: {
		containerHeight: 600,
	},
};

export default loginMeta;
