import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

import { style } from "./style";

export const user = pgTable("user", (t) => ({
	id: t.text().primaryKey(),
	name: t.text().notNull(),
	username: t.text().notNull().unique(),
	email: t.text().notNull().unique(),
	emailVerified: t.boolean().notNull(),
	image: t.text(),
	role: t.text().notNull().default("user"),
	activeStyleId: t.uuid().references((): AnyPgColumn => style.id, { onDelete: "set null" }),
	createdAt: t.timestamp().notNull(),
	updatedAt: t.timestamp().notNull(),
}));

export const userRelations = relations(user, ({ many }) => ({
	styles: many(style),
}));

export const session = pgTable("session", (t) => ({
	id: t.text().primaryKey(),
	expiresAt: t.timestamp().notNull(),
	token: t.text().notNull().unique(),
	createdAt: t.timestamp().notNull(),
	updatedAt: t.timestamp().notNull(),
	ipAddress: t.text(),
	userAgent: t.text(),
	userId: t
		.text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
}));

export const account = pgTable("account", (t) => ({
	id: t.text().primaryKey(),
	accountId: t.text().notNull(),
	providerId: t.text().notNull(),
	userId: t
		.text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: t.text(),
	refreshToken: t.text(),
	idToken: t.text(),
	accessTokenExpiresAt: t.timestamp(),
	refreshTokenExpiresAt: t.timestamp(),
	scope: t.text(),
	password: t.text(),
	createdAt: t.timestamp().notNull(),
	updatedAt: t.timestamp().notNull(),
}));

export const verification = pgTable("verification", (t) => ({
	id: t.text().primaryKey(),
	identifier: t.text().notNull(),
	value: t.text().notNull(),
	expiresAt: t.timestamp().notNull(),
	createdAt: t.timestamp(),
	updatedAt: t.timestamp(),
}));
