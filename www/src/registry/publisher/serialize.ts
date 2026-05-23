export function serializeTvConfig(config: Record<string, unknown>): string {
	return JSON.stringify(config, null, 2);
}
