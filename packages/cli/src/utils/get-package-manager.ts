import { detect, type AgentName } from "package-manager-detector";

export async function getPackageManager(cwd: string): Promise<AgentName> {
  const detectResult = await detect({ cwd });
  if (detectResult) {
    return detectResult.name;
  }
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.startsWith("yarn")) {
      return "yarn";
    } else if (userAgent.startsWith("pnpm")) {
      return "pnpm";
    } else if (userAgent.startsWith("bun")) {
      return "bun";
    } else {
      return "npm";
    }
  }
  return "npm";
}
