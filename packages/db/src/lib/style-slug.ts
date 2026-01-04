export type ParsedStyleSlug = { type: "public"; name: string } | { type: "user"; username: string; name: string };

export function parseStyleSlug(slug: string): ParsedStyleSlug {
	const parts = slug.split("/");
	if (parts.length === 1) {
		const name = parts[0] as string;
		return { type: "public", name };
	}
	const [username, name] = parts as [string, string];
	return { type: "user", username, name };
}

export function buildStyleSlug(username: string | null, name: string): string {
	return username ? `${username}/${name}` : name;
}
