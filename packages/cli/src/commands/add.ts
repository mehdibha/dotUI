import * as p from "@clack/prompts";
import { Command } from "commander";
import { addPrimitives } from "@/helpers/add-primitives";
import { handleError } from "@/helpers/handle-error";
import { c } from "@/utils";

export const addCommand = new Command()
  .name("add")
  .description(
    "add primitives to your project and install required dependencies"
  )
  .argument(
    "[primitives...]",
    "the primitives to add wheather components, hoooks, themes."
  )
  .helpOption("-h, --help", "show all available options")
  .option("-o, --overwrite", "overwrite existing files.", false)
  .option("-a, --all", "add all available core components.", false)
  .option(
    "-d --dir",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(
    async (
      components: string[],
      options: { overwrite: boolean; all: boolean; dir: string }
    ) => {
      try {
        p.intro("Adding primitives.");
        await addPrimitives(components, {}, { overwrite: options.overwrite, message: "Updating your project" });
        p.outro(
          `Successfully added ${c.info("button, text-field, and 21 other components.")}`
        );
      } catch (error) {
        p.outro(
          c.error(
            "Someting went wrong. If the problem persists, please open an issue on GitHub."
          )
        );
        handleError(error);
      }
    }
  );
