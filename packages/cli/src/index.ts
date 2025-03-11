#!/usr/bin/env node
import { Command } from "commander";
import packageJson from "~/package.json";
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";

async function main() {
  const program = new Command()
    .name("dotui")
    .description("CLI to setup dotUI.")
    .helpOption("-h, --help", "Display this help message.")
    .usage("[command] [options]")
    .version(
      packageJson.version,
      "-v, --version",
      "Output the current version of dotui-cli."
    );

  program.addCommand(initCommand).addCommand(addCommand);

  program.parse();
}

main();
