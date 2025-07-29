import { eq } from "drizzle-orm";
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
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    name: t.varchar({ length: 100 }).notNull(),
    description: t.text(),
    visibility: t
      .varchar("visibility", { length: 10 })
      .notNull()
      .default("unlisted"),
    isFeatured: t.boolean("is_featured").notNull().default(false),
    theme: t.jsonb("theme").$type<MinimizedThemeDefinition>().notNull(),
    icons: t.jsonb("icons").$type<MinimizedIconsDefinition>(),
    variants: t.jsonb("variants").$type<MinimizedVariantsDefinition>(),
    userId: t
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => new Date()),
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
