import { z } from "zod/v4";
import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@dotui/db";
import { style, user } from "@dotui/db/schema";
import { restoreStyleDefinitionDefaults } from "@dotui/style-engine/utils";

import { protectedProcedure, publicProcedure } from "../trpc";

export const styleRouter = {
  getCurrentStyle: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user.selectedStyle;
  }),
  updateCurrentStyle: protectedProcedure
    .input(
      z.object({
        styleId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(user)
        .set({
          selectedStyle: input.styleId,
        })
        .where(eq(user.id, ctx.session.user.id));

      return ctx.session.user.selectedStyle;
    }),
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
        return restoreStyleDefinitionDefaults(style);
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

      return restoreStyleDefinitionDefaults(rawStyle);
    }),
} satisfies TRPCRouterRecord;
