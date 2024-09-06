import { z } from "zod";

export const initOptionsSchema = z.object({
  cwd: z.string(),
  components: z.array(z.string()).optional(),
  yes: z.boolean(),
  defaults: z.boolean(),
  force: z.boolean(),
  silent: z.boolean(),
  isNewProject: z.boolean(),
  skipPreflight: z.boolean().optional(),
  srcDir: z.boolean().optional(),
});
