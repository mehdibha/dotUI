import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { TRPCRouterRecord } from "@trpc/server";

import { and, eq } from "@dotui/db";
import { style, user } from "@dotui/db/schemas";
import { styleDefinitionSchema } from "@dotui/style-engine/schemas";
import {
  minimizeStyleDefinition,
  restoreStyleDefinitionDefaults,
} from "@dotui/style-engine/utils";

import { protectedProcedure, publicProcedure } from "../trpc";

// Input validation schemas
const uuidSchema = z.string().min(1)
const paginationSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

export const styleRouter = {
  getActive: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user.activeStyleId;
  }),
  setActive: protectedProcedure
    .input(
      z.object({
        styleId: uuidSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(user)
        .set({
          activeStyleId: input.styleId,
        })
        .where(eq(user.id, ctx.session.user.id));

      return input.styleId;
    }),
  getFeatured: publicProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const styles = await ctx.db.query.style.findMany({
        where: eq(style.isFeatured, true),
        limit: input.limit,
        offset: input.offset,
      });

      const result = styles.map((style) => {
        return { ...style, ...restoreStyleDefinitionDefaults(style) };
      });

      return result;
    }),
  getById: publicProcedure
    .input(z.object({ id: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const rawStyle = await ctx.db.query.style.findFirst({
        where: eq(style.id, input.id),
      });

      if (!rawStyle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Style not found",
        });
      }

      return { ...rawStyle, ...restoreStyleDefinitionDefaults(rawStyle) };
    }),
  getbyNameAndUsername: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Style name cannot be empty"),
        userId: uuidSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const rawStyle = await ctx.db.query.style.findFirst({
        where: and(eq(style.name, input.name), eq(style.userId, input.userId)),
      });

      if (!rawStyle) {
        return undefined;
      }

      return { ...rawStyle, ...restoreStyleDefinitionDefaults(rawStyle) };
    }),
  create: protectedProcedure
    .input(styleDefinitionSchema)
    .mutation(async ({ ctx, input }) => {
      return;
    }),
  update: protectedProcedure
    .input(styleDefinitionSchema.extend({ id: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const existingStyle = await tx.query.style.findFirst({
          where: eq(style.id, input.id),
        });

        if (!existingStyle) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Style with ID '${input.id}' not found`,
          });
        }

        if (existingStyle.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You can only update your own styles",
          });
        }

        const minimizedStyle = minimizeStyleDefinition(input);

        const [updatedStyle] = await tx
          .update(style)
          .set(minimizedStyle)
          .where(eq(style.id, input.id))
          .returning();

        return updatedStyle;
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      return;
    }),
} satisfies TRPCRouterRecord;
