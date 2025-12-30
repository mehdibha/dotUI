const OWNER = "mehdibha";
const REPO = "dotUI";

export async function getGitHubContributors(): Promise<{ login: string; avatar_url: string; html_url: string }[]> {
	const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contributors`, {
		headers: {
			Accept: "application/vnd.github+json",
		},
	});

	if (!response?.ok) {
		return [];
	}

	const json = await response.json();
	return [
		...json,
		{
			login: "Cursor agent",
			avatar_url: "https://github.com/cursoragent.png",
			html_url: "https://github.com/cursoragent",
		},
	];
}

export async function getGitHubStars(): Promise<string | null> {
	try {
		const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
			headers: {
				Accept: "application/vnd.github+json",
			},
		});

		if (!response?.ok) {
			return null;
		}

		const json = await response.json();
		return parseInt(json.stargazers_count, 10).toLocaleString();
	} catch (error) {
		console.error(error);
		return null;
	}
}
