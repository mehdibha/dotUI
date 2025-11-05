import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { TRPCRouterRecord } from "@trpc/server";

import { and, eq } from "@dotui/db";
import { createStyleSchema, style, user } from "@dotui/db/schemas";
import { styleDefinitionSchema } from "@dotui/registry/style-system/schemas";

import { protectedProcedure, publicProcedure } from "../trpc";

const uuidSchema = z.string().uuid("Invalid UUID format");
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
      // Verify style exists
      const styleRecord = await ctx.db.query.style.findFirst({
        where: eq(style.id, input.styleId),
      });

      if (!styleRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Style not found",
        });
      }

      // Verify user has access (must own it or it must be public/unlisted)
      const isOwner = styleRecord.userId === ctx.session.user.id;
      const isPublicOrUnlisted = ["public", "unlisted"].includes(
        styleRecord.visibility,
      );

      if (!isOwner && !isPublicOrUnlisted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this style",
        });
      }

      await ctx.db
        .update(user)
        .set({
          activeStyleId: input.styleId,
        })
        .where(eq(user.id, ctx.session.user.id));

      return input.styleId;
    }),
  getPublicStyles: publicProcedure
    .input(
      paginationSchema.extend({
        featured: z.boolean().optional(),
        sortBy: z.enum(["newest", "oldest"]).default("newest"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { featured, sortBy, ...pagination } = input;

      // Build where condition
      const whereCondition =
        featured === true
          ? and(eq(style.visibility, "public"), eq(style.isFeatured, true))
          : eq(style.visibility, "public");

      const styles = await ctx.db.query.style.findMany({
        where: whereCondition,
        orderBy: (s, { desc, asc }) => [
          sortBy === "oldest" ? asc(s.createdAt) : desc(s.createdAt),
        ],
        limit: pagination.limit,
        offset: pagination.offset,
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
        orderBy: (s, { desc }) => [desc(s.updatedAt)],
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
  getById: publicProcedure
    .input(z.object({ id: uuidSchema }))
    .query(async ({ ctx, input }) => {
      const styleRecord = await ctx.db.query.style.findFirst({
        where: eq(style.id, input.id),
        with: {
          user: {
            columns: {
              username: true,
              image: true,
            },
          },
        },
      });

      if (!styleRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Style not found",
        });
      }

      // Check access permissions
      const isOwner = ctx.session?.user.id === styleRecord.userId;
      const isPublicOrUnlisted = ["public", "unlisted"].includes(
        styleRecord.visibility,
      );

      if (!isOwner && !isPublicOrUnlisted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this private style",
        });
      }

      return styleRecord;
    }),
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const parts = input.slug.split("/");

      // biome-ignore lint/suspicious/noImplicitAnyLet: styleRecord is conditionally assigned based on slug format
      let styleRecord

      if (parts.length === 2) {
        // Format: "username/stylename"
        const [username, styleName] = parts;

        if (!username || !styleName) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid slug format",
          });
        }

        // Find user
        const targetUser = await ctx.db.query.user.findFirst({
          where: eq(user.username, username),
        });

        if (!targetUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Find style
        styleRecord = await ctx.db.query.style.findFirst({
          where: and(
            eq(style.userId, targetUser.id),
            eq(style.name, styleName),
          ),
          with: {
            user: {
              columns: {
                username: true,
                image: true,
              },
            },
          },
        });
      } else if (parts.length === 1) {
        // Format: "stylename" (public styles only)
        styleRecord = await ctx.db.query.style.findFirst({
          where: and(
            eq(style.name, input.slug),
            eq(style.visibility, "public"),
          ),
          with: {
            user: {
              columns: {
                username: true,
                image: true,
              },
            },
          },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Invalid slug format. Use 'username/stylename' or 'stylename' for public styles",
        });
      }

      if (!styleRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Style not found",
        });
      }

      // Check access permissions
      const isOwner = ctx.session?.user.id === styleRecord.userId;
      const isPublicOrUnlisted = ["public", "unlisted"].includes(
        styleRecord.visibility,
      );

      if (!isOwner && !isPublicOrUnlisted) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this private style",
        });
      }

      return styleRecord;
    }),
  create: protectedProcedure
    .input(createStyleSchema)
    .mutation(async ({ ctx, input }) => {
      // Ensure public style names are globally unique
      if (input.visibility === "public") {
        const existingPublic = await ctx.db.query.style.findFirst({
          where: and(
            eq(style.name, input.name),
            eq(style.visibility, "public"),
          ),
        });

        if (existingPublic) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `Public style name '${input.name}' is already taken. Please choose another name.`,
          });
        }
      }

      // Ensure style names are unique per user regardless of visibility
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
      return await ctx.db.transaction(async (tx) => {
        const existingStyle = await tx.query.style.findFirst({
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
            code: "FORBIDDEN",
            message: "You can only update your own styles.",
          });
        }

        const { id, theme, icons, variants } = input;

        const [updatedStyle] = await tx
          .update(style)
          .set({
            theme,
            icons,
            variants,
            updatedAt: new Date(),
          })
          .where(eq(style.id, id))
          .returning();

        return updatedStyle;
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const styleRecord = await tx.query.style.findFirst({
          where: eq(style.id, input.id),
        });

        if (!styleRecord) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Style not found",
          });
        }

        if (styleRecord.userId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only delete your own styles",
          });
        }

        // Prevent deleting active style
        if (ctx.session.user.activeStyleId === input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Cannot delete your active style. Please set a different active style first.",
          });
        }

        await tx.delete(style).where(eq(style.id, input.id));

        return { success: true };
      });
    }),
} satisfies TRPCRouterRecord;
