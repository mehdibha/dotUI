import { getGithubLastEdit as getGithubLastEdit_ } from "fumadocs-core/server";

import { env } from "@/env";

const OWNER = "mehdibha";
const REPO = "dotUI";

export const getGithubLastEdit = async (path: string) => {
  return await getGithubLastEdit_({
    owner: OWNER,
    repo: REPO,
    path: `www/content/${path}`,
  });
};

export const getGitHubContributors = async (): Promise<
  { login: string; avatar_url: string; html_url: string }[]
> => {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contributors`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: {
        revalidate: 120,
      },
    },
  );
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
};

export async function getGitHubStars(): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: {
          revalidate: 60,
        },
      },
    );

    if (!response?.ok) {
      return null;
    }

    const json = await response.json();

    return parseInt(json.stargazers_count).toLocaleString();
  } catch (error) {
    console.error(error);
    return null;
  }
}
