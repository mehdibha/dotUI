#!/usr/bin/env node
// Inspired by: https://github.com/shadcn-ui/ui/blob/main/packages/shadcn
import { Command } from "commander";
import { addCommand } from "@/commands/add";
import { init } from "@/commands/init";
import packageJson from "~/package.json";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("dotui")
    .helpOption("-h, --help", "Display this help message.")
    .usage("[command] [options]")
    .version(
      packageJson.version,
      "-v, --version",
      "Output the current version of dotUI."
    );

  program.addCommand(init).addCommand(addCommand);

  program.parse();
}

main();
