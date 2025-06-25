// import { sql } from "drizzle-orm";
// import { pgTable } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod/v4";

// import type { StyleDefinition } from "@dotui/style-engine/types";

// interface ColorScale {
//   baseColors: string[];
//   contrastRatios?: number[];
// }

// interface ColorPalette {
//   neutral: ColorScale;
//   accent: ColorScale;
//   success: ColorScale;
//   warning: ColorScale;
//   danger: ColorScale;
//   info: ColorScale;
// }

// interface ColorMode {
//   lightness: number;
//   saturation: number;
//   palette: ColorPalette;
// }

// interface ThemeDefinition {
//   borderRadius?: number;
//   lightMode?: ColorMode;
//   darkMode?: ColorMode;
//   semanticTokens?: Record<string, string>;
//   customProperties?: Record<
//     string,
//     string | Record<string, string | Record<string, string>>
//   >;
// }

// interface TypographyScale {
//   headingFont: string;
//   bodyFont: string;
// }

// export const Style = pgTable("style", (t) => ({
//   id: t.uuid().notNull().primaryKey().defaultRandom(),
//   name: t.varchar({ length: 256 }).notNull(),
//   label: t.varchar({ length: 256 }).notNull(),
//   description: t.text(),
//   definition: t.json("definition").$type<StyleDefinition>().notNull(),
//   createdAt: t.timestamp().defaultNow().notNull(),
//   updatedAt: t
//     .timestamp({ mode: "date", withTimezone: true })
//     .$onUpdateFn(() => sql`now()`),
// }));

// export const CreateStyleSchema = createInsertSchema(Style, {
//   name: z.string().max(256),
//   label: z.string().max(256),
// }).omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });

export * from "./auth-schema";
