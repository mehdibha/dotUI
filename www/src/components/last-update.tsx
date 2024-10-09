import { getGithubLastEdit } from "@/lib/docs/get-github-last-edit";

export async function PageLastUpdate({ path }: { path: string }) {
  const date = await getGithubLastEdit(path);

  if (!date) return null;
  return (
    <p className="text-fg-muted text-sm">
      Last updated on {date.toLocaleDateString()}
    </p>
  );
}
