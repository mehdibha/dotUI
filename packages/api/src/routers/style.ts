import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { TRPCRouterRecord } from "@trpc/server";

import { and, eq } from "@dotui/db";
import { style, user } from "@dotui/db/schemas";
import { styleDefinitionSchema } from "@dotui/style-engine/schemas";

import { protectedProcedure, publicProcedure } from "../trpc";

// Input validation schemas
const uuidSchema = z.string().min(1);
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
        with: {
          user: {
            columns: {
              username: true,
              image: true,
            },
          },
        },
      });

      return styles;
    }),
  getByPublicName: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.style.findFirst({
        where: and(eq(style.name, input.name), eq(style.visibility, "public")),
      });
    }),
  byPublicSlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.style.findFirst({
        where: and(eq(style.name, input.slug), eq(style.visibility, "public")),
      });
    }),
  getById: publicProcedure
    .input(z.object({ id: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const styleRecord = await ctx.db.query.style.findFirst({
        where: eq(style.id, input.id),
      });

      if (!styleRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Style not found",
        });
      }

      return styleRecord;
    }),
  getByNameAndUsername: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Style name cannot be empty"),
        username: z.string().min(1, "Username cannot be empty"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userRecord = await ctx.db.query.user.findFirst({
        where: eq(user.username, input.username),
      });

      if (!userRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const styleRecord = await ctx.db.query.style.findFirst({
        where: and(eq(style.userId, userRecord.id), eq(style.name, input.name)),
      });

      if (!styleRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Style not found",
        });
      }

      return styleRecord;
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

        const [updatedStyle] = await tx
          .update(style)
          .set(input)
          .where(eq(style.id, input.id))
          .returning();

        return updatedStyle;
      });
    }),
  // delete: protectedProcedure
  //   .input(z.object({ id: uuidSchema }))
  //   .mutation(async ({ ctx, input }) => {
  //     return;
  //   }),
} satisfies TRPCRouterRecord;
