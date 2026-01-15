import { createServerFn } from "@tanstack/react-start";

import { publicCaller } from "@dotui/api";

export const getFeaturedStyles = createServerFn({ method: "GET" }).handler(() =>
	publicCaller.style.getPublicStyles({ featured: true, limit: 6, sortBy: "oldest" })
);
