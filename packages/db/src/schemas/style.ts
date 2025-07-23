import { pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import type {
  MinimizedIconsDefinition,
  MinimizedThemeDefinition,
  MinimizedVariantsDefinition,
} from "@dotui/style-engine/types";

import { user } from "./auth";

/** Tables **/
export const style = pgTable("style", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  slug: t.varchar({ length: 256 }).notNull().unique(),
  description: t.text(),
  theme: t.jsonb("theme").$type<MinimizedThemeDefinition>().notNull(),
  icons: t.jsonb("icons").$type<MinimizedIconsDefinition>(),
  variants: t.jsonb("variants").$type<MinimizedVariantsDefinition>(),
  isFeatured: t.boolean("is_featured").notNull().default(false),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => new Date()),
}));

/** Validations **/
export const createStyleSchema = createInsertSchema(style).omit({
  id: true,
  isFeatured: true,
  createdAt: true,
  updatedAt: true,
});
