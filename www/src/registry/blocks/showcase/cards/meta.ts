import type { RegistryItem } from "@/registry/types";

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
			path: "blocks/showcase/cards/components/cookie-preferences.tsx",
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
			path: "blocks/showcase/cards/components/faq.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/feedback.tsx",
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
			path: "blocks/showcase/cards/components/payment.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/shortcuts.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/storage.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/team-name.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/transactions.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/two-factor.tsx",
			type: "registry:component",
		},
		{
			path: "blocks/showcase/cards/components/upload-avatar.tsx",
			type: "registry:component",
		},
	],
	categories: ["featured", "showcase"],
	meta: {
		containerHeight: 600,
	},
};

export default cardsMeta;
