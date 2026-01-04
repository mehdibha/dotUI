import type { RegistryItem } from "@dotui/registry/types";

const cardsMeta: RegistryItem = {
	name: "cards",
	description: "A set of cards.",
	type: "registry:block",
	registryDependencies: ["all"],
	files: [
		{
			path: "blocks/showcase/cards/components/cards.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/account-menu.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/backlog.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/booking.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/color-editor.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/filters.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/invite-members.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/login-form.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/notifications.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/team-name.tsx",
			type: "registry:component",
		},
	],
	categories: ["featured", "showcase"],
	meta: {
		containerHeight: 600,
	},
};

export default cardsMeta;
