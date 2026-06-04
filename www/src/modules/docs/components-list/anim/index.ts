import type { ComponentType } from "react";

/**
 * Animated, self-demoing previews for the components page. Each `demos/<slug>.tsx`
 * default-exports a component that renders the real component (controlled) and
 * choreographs a fake cursor through a looping demo; hovering a card pauses the
 * loop and hands the real component to the user.
 *
 * Files are auto-registered by filename (slug) via a Vite glob, so adding a
 * preview is just dropping a `demos/<slug>.tsx` file — no edits here.
 */
const modules = import.meta.glob<{ default: ComponentType }>("./demos/*.tsx", { eager: true });

export const animatedDemos: Record<string, ComponentType> = Object.fromEntries(
	Object.entries(modules).map(([path, mod]) => {
		const slug = path.slice(path.lastIndexOf("/") + 1, -".tsx".length);
		return [slug, mod.default];
	}),
);
