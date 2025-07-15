import { z } from "zod/v4";
import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@dotui/db";
import { style } from "@dotui/db/schema";
import { createStyleDefinition } from "@dotui/style-engine/lib";

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
    .query(async ({ ctx, input }) => {
      const styles = await ctx.db.query.style.findMany({
        where: eq(style.isFeatured, input.isFeatured ?? true),
      });

      const result = styles.map((style) => {
        return {
          name: style.name,
          slug: style.slug,
          description: style.description,
          ...createStyleDefinition(style),
        };
      });

      return result;
    }),
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const rawStyle = await ctx.db.query.style.findFirst({
        where: eq(style.slug, input.slug),
      });

      if (!rawStyle) {
        return undefined;
      }

      return createStyleDefinition(rawStyle);
    }),
} satisfies TRPCRouterRecord;
