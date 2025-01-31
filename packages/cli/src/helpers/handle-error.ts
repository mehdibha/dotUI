import { logger } from "@/utils";

export function handleError(error: unknown) {
  if (typeof error === "string") {
    logger.error(`Error: ${error}`);
    process.exit(1);
  }

  if (error instanceof Error) {
    logger.error(`Error: {error.message}`);
    process.exit(1);
  }

  process.exit(1);
}
