import { z } from "zod";
import { c, logger } from "@/utils";

export function handleError(error: unknown) {
  if (typeof error === "string") {
    logger.error(`Error: ${error}`);
    process.exit(1);
  }

  if (error instanceof z.ZodError) {
    logger.error("Validation failed:");
    for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
      logger.error(`- ${c.info(key)}: ${value}`);
    }
    logger.break();
    process.exit(1);
  }

  if (error instanceof Error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }

  process.exit(1);
}
