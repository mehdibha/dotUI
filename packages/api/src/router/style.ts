import { z } from "zod/v4";
import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@dotui/db";
import { style } from "@dotui/db/schema";

import { publicProcedure } from "../trpc";

export const styleRouter = {
  all: publicProcedure
    .input(
      z.object({
        isFeatured: z.boolean().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.style.findMany({
        where: eq(style.isFeatured, input.isFeatured ?? true),
      });
    }),
} satisfies TRPCRouterRecord;
