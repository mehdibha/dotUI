import { execa } from "execa";
import type { PackageManager } from "./get-pkg-manager";

export async function installDeps(
  /** Indicate which package manager to use. */
  packageManager: PackageManager
): Promise<void> {
  const args: string[] = ["install"];

  try {
    await execa(packageManager, args, {
      stdio: "inherit",
      env: {
        ...process.env,
        ADBLOCK: "1",
        // we set NODE_ENV to development as pnpm skips dev
        // dependencies when production
        NODE_ENV: "development",
        DISABLE_OPENCOLLECTIVE: "1",
      },
    });
  } catch (error) {
    throw new Error(`Failed to run ${packageManager} ${args.join(" ")}`);
  }
}
