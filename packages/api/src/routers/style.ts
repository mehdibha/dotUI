import { z } from "zod/v4";
import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@dotui/db";
import { style, user } from "@dotui/db/schema";
import { styleDefinitionSchema } from "@dotui/style-engine/schemas";
import {
  minimizeStyleDefinition,
  restoreStyleDefinitionDefaults,
} from "@dotui/style-engine/utils";

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
  update: protectedProcedure
    .input(styleDefinitionSchema)
    .mutation(async ({ ctx, input }) => {
      const existingStyle = await ctx.db.query.style.findFirst({
        where: eq(style.slug, input.slug),
      });

      if (!existingStyle) {
        throw new Error("Style not found");
      }

      if (existingStyle.userId !== ctx.session.user.id) {
        throw new Error("Unauthorized: You can only update your own styles");
      }

      const minimizedStyle = minimizeStyleDefinition(input);

      const [updatedStyle] = await ctx.db
        .update(style)
        .set(minimizedStyle)
        .where(eq(style.slug, input.slug))
        .returning();

      return updatedStyle;
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
