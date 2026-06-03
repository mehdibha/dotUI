// AUTO-GENERATED - DO NOT EDIT
// Run "tsx scripts/registry-build.ts" to regenerate
import * as React from "react";

export const BlocksIndex: Record<
	string,
	{
		files: string[];
		component: React.LazyExoticComponent<React.ComponentType<object>>;
	}
> = {
	login: {
		files: ["blocks/auth/login/page.tsx", "blocks/auth/login/components/login-form.tsx"],
		component: React.lazy(() => import("@/registry/blocks/auth/login/page")),
	},
	cards: {
		files: [
			"blocks/showcase/cards/components/cards.tsx",
			"blocks/showcase/cards/components/account-menu.tsx",
			"blocks/showcase/cards/components/cookie-preferences.tsx",
			"blocks/showcase/cards/components/booking.tsx",
			"blocks/showcase/cards/components/color-editor.tsx",
			"blocks/showcase/cards/components/faq.tsx",
			"blocks/showcase/cards/components/feedback.tsx",
			"blocks/showcase/cards/components/filters.tsx",
			"blocks/showcase/cards/components/invite-members.tsx",
			"blocks/showcase/cards/components/login-form.tsx",
			"blocks/showcase/cards/components/notifications.tsx",
			"blocks/showcase/cards/components/payment.tsx",
			"blocks/showcase/cards/components/shortcuts.tsx",
			"blocks/showcase/cards/components/storage.tsx",
			"blocks/showcase/cards/components/team-name.tsx",
			"blocks/showcase/cards/components/transactions.tsx",
			"blocks/showcase/cards/components/two-factor.tsx",
			"blocks/showcase/cards/components/upload-avatar.tsx",
		],
		component: React.lazy(() => import("@/registry/blocks/showcase/cards/components/cards")),
	},
};
