import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

import type { StyleDefinition } from "@dotui/style-engine/types";

export const Style = pgTable("style", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 256 }).notNull(),
  description: t.text(),
  definition: t.jsonb("definition").$type<StyleDefinition>().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export * from "./auth-schema";
