import { getConfig } from "./get-config";

export async function addChecks(cwd: string) {
  const config = await getConfig(cwd);
  if (!config) throw new Error("Failed to load config.");
  return { config };
}
