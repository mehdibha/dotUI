import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

import type {
  Fonts,
  ThemeDefinition,
  Variants,
} from "@dotui/style-engine/types";
import { user } from "./auth-schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const style = pgTable("style", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  slug: t.varchar({ length: 256 }).notNull().unique(),
  description: t.text(),
  isFeatured: t.boolean("is_featured").notNull().default(false),
  iconLibrary: t
    .varchar("icon_library", { length: 20 })
    .notNull()
    .default("lucide"),
  fonts: t.jsonb("fonts").$type<Partial<Fonts>>(),
  variants: t.jsonb("variants").$type<Partial<Variants>>(),
  theme: t.jsonb("theme").$type<ThemeDefinition>().notNull().default({}),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const createStyleSchema = createInsertSchema(style)
  .omit({
    id: true,
    isFeatured: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    name: z.string().min(1).max(256),
    description: z.string().max(500).optional(),
  });

export * from "./auth-schema";



