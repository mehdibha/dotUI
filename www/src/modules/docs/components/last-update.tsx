import { getGithubLastEdit } from "@/lib/github";

export async function PageLastUpdate({ path }: { path: string }) {
  try {
    const date = await getGithubLastEdit(path);
    if (!date) return null;
    return (
      <p className="text-sm text-fg-muted">
        Last updated on {date.toLocaleDateString()}
      </p>
    );
  } catch (e) {
    console.error(e);
    return null;
  }
}
