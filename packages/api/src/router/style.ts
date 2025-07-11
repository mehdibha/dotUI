import { z } from "zod/v4";
import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@dotui/db";
import { style } from "@dotui/db/schema";
import { createStyle } from "@dotui/style-engine";

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
        return createStyle(style);
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

      return createStyle(rawStyle);
    }),
  // create: protectedProcedure
  //   .input(createStyleSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     const [newStyle] = await ctx.db
  //       .insert(style)
  //       .values({
  //         ...input,
  //         userId: ctx.session.user.id,
  //       })
  //       .returning();

  //     return createStyle(newStyle);
  //   }),
  // update: protectedProcedure
  //   .input(
  //     z.object({
  //       id: z.string().uuid(),
  //       data: createStyleSchema.partial().omit({ userId: true }),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const [updatedStyle] = await ctx.db
  //       .update(style)
  //       .set(input.data)
  //       .where(eq(style.id, input.id))
  //       .returning();

  //     return createStyle(updatedStyle);
  //   }),
} satisfies TRPCRouterRecord;
