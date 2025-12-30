export function truncateOnWord(text: string, maxLength: number, ellipsis = true): string {
	if (text.length <= maxLength) return text;
	let truncated = text.substring(0, maxLength);
	truncated = truncated.substring(0, Math.min(truncated.length, truncated.lastIndexOf(" ")));
	if (ellipsis) truncated += "...";
	return truncated;
}
