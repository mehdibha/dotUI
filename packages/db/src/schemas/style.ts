import { relations, sql } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp, unique, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

import { type StyleConfig, styleConfigSchema } from "@dotui/core/schemas";

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
		isPreset: boolean("is_preset").notNull().default(false),
		config: jsonb("config").$type<StyleConfig>().notNull(),
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
		uniqueIndex("unique_public_name").on(table.name).where(sql`visibility = 'public'`),
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
		isPreset: true,
		createdAt: true,
		updatedAt: true,
		userId: true,
	})
	.extend({
		name: z
			.string()
			.max(100, "Style name must be 100 characters or less")
			.regex(/^[a-z0-9._-]+$/, "Style name must be lowercase and can only contain letters, digits, '.', '_', and '-'"),
		config: styleConfigSchema,
	});

/** Schema for updating style config */
export const updateStyleConfigSchema = z.object({
	id: z.string().uuid(),
	config: styleConfigSchema,
});
