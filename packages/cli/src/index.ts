#!/usr/bin/env node
import { Command } from "commander";
import packageJson from "~/package.json";
import { createCommand } from "@/commands/create";
import { init } from "@/commands/init";
import { addCommand } from "@/commands/add";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("dotui")
    .helpOption("-h, --help", "Display this help message.")
    .usage('[command] [options]')
    .version(
      packageJson.version,
      "-v, --version",
      "Output the current version of dotUI."
    );

  program.addCommand(createCommand).addCommand(init).addCommand(addCommand);

  program.parse();
}

main();
