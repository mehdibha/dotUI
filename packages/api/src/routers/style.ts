import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { TRPCRouterRecord } from "@trpc/server";

import { and, eq } from "@dotui/db";
import { createStyleSchema, style, user } from "@dotui/db/schemas";
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
  getMyStyles: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const styles = await ctx.db.query.style.findMany({
        where: eq(style.userId, ctx.session.user.id),
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
  getPublicRecent: publicProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const styles = await ctx.db.query.style.findMany({
        where: eq(style.visibility, "public"),
        orderBy: (s, { desc }) => [desc(s.createdAt)],
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
  create: protectedProcedure
    .input(createStyleSchema)
    .mutation(async ({ ctx, input }) => {
      // Prevent duplicate style names per user (also enforced by DB unique index)
      const existing = await ctx.db.query.style.findFirst({
        where: and(
          eq(style.userId, ctx.session.user.id),
          eq(style.name, input.name),
        ),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: ` Style ${input.name} already exists, please use a new name.`,
        });
      }

      const [created] = await ctx.db
        .insert(style)
        .values({
          ...input,
          userId: ctx.session.user.id,
        })
        .returning();

      return created;
    }),
  update: protectedProcedure
    .input(styleDefinitionSchema.extend({ id: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const existingStyle = await ctx.db.query.style.findFirst({
        where: eq(style.id, input.id),
      });

      if (!existingStyle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Style with ID '${input.id}' not found.`,
        });
      }

      if (existingStyle.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can only update your own styles.",
        });
      }

      return await ctx.db
        .update(style)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(style.id, input.id))
        .returning();
    }),
  // delete: protectedProcedure
  //   .input(z.object({ id: uuidSchema }))
  //   .mutation(async ({ ctx, input }) => {
  //     return;
  //   }),
} satisfies TRPCRouterRecord;
