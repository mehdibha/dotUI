#!/usr/bin/env node
import { init } from "@/commands/init";
import { Command } from "commander";
import packageJson from "~/package.json";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("dotui")
    .description("add components and dependencies to your project")
    .version(
      packageJson.version,
      "-v, --version",
      "'Output the current version of dotui."
    );

  program.addCommand(init);

  program.parse();
}

main();
