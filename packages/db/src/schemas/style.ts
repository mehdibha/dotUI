import { eq, sql } from "drizzle-orm";
import { pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import type {
  MinimizedIconsDefinition,
  MinimizedThemeDefinition,
  MinimizedVariantsDefinition,
} from "@dotui/style-engine/types";

import { user } from "./auth";

/** Tables **/
export const style = pgTable(
  "style",
  (t) => ({
    id: t.text("id").primaryKey(),
    name: t.text("name").notNull(),
    description: t.text(),
    visibility: t
      .text("visibility", { enum: ["public", "unlisted", "private"] })
      .notNull()
      .default("unlisted"),
    isFeatured: t.boolean("is_featured").notNull().default(false),
    theme: t.jsonb("theme").$type<MinimizedThemeDefinition>().notNull(),
    icons: t.jsonb("icons").$type<MinimizedIconsDefinition>(),
    variants: t.jsonb("variants").$type<MinimizedVariantsDefinition>(),
    userId: t
      .text("user_id")
      .references(() => user.id, { onDelete: "set null" }),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
  }),
  (t) => ({
    userNameUnique: uniqueIndex().on(t.userId, t.name),
    publicNameUnique: uniqueIndex()
      .on(t.name)
      .where(eq(t.visibility, "public")),
  }),
);

/** Validations **/
export const createStyleSchema = createInsertSchema(style)
  .omit({
    id: true,
    isFeatured: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  })
  .extend({
    name: z
      .string()
      .max(100, "Style name must be 100 characters or less")
      .regex(
        /^[a-z0-9._-]+$/,
        "Style name must be lowercase and can only contain letters, digits, '.', '_', and '-'",
      ),
  });
