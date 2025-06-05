import { getGithubLastEdit as getGithubLastEdit_ } from "fumadocs-core/server";

export const getGithubLastEdit = async (path: string) => {
  return await getGithubLastEdit_({
    owner: "mehdibha",
    repo: "dotUI",
    path: `content/${path}`,
  });
};
