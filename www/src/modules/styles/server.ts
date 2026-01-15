import { createServerFn } from "@tanstack/react-start";

export const getFeaturedStyles = createServerFn({ method: "GET" }).handler(
	async () => {
		const { publicCaller } = await import("@dotui/api");
		return publicCaller.style.getPublicStyles({
			featured: true,
			limit: 6,
			sortBy: "oldest",
		});
	}
);
