import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import {
  iconsDefinitionSchema,
  themeDefinitionSchema,
  variantsDefinitionSchema,
} from "@dotui/registry/schemas";
import type {
  IconsDefinition,
  ThemeDefinition,
  VariantsDefinition,
} from "@dotui/style-system/types";

import { user } from "./auth";

/** Tables **/
export const style = pgTable(
  "style",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    visibility: text("visibility", { enum: ["public", "unlisted", "private"] })
      .notNull()
      .default("unlisted"),
    isFeatured: boolean("is_featured").notNull().default(false),
    theme: jsonb("theme").$type<ThemeDefinition>().notNull(),
    icons: jsonb("icons").$type<IconsDefinition>().notNull(),
    variants: jsonb("variants").$type<VariantsDefinition>().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
  },
  (table) => [
    unique("unique_name_per_user").on(table.userId, table.name),
    index("unique_public_name")
      .on(table.name)
      .where(sql.raw(`visibility = 'public'`)),
  ],
);

export const styleRelations = relations(style, ({ one }) => ({
  user: one(user, {
    fields: [style.userId],
    references: [user.id],
  }),
}));

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
    theme: themeDefinitionSchema,
    icons: iconsDefinitionSchema,
    variants: variantsDefinitionSchema,
  });
