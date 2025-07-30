import { isNull } from "drizzle-orm";

import { createStyle } from "@dotui/style-engine/core";
import {
  styleDefinitionSchema,
  styleSchema,
} from "@dotui/style-engine/schemas";
import { restoreStyleDefinitionDefaults } from "@dotui/style-engine/utils";

import { db } from "./client";
import { DEFAULT_STYLES } from "./constants";
import { style } from "./schemas";

async function validateDefaultStyles() {
  for (const style of DEFAULT_STYLES) {
    const restoredStyle = restoreStyleDefinitionDefaults(style);
    await styleDefinitionSchema.parseAsync(restoredStyle);
    const styleResult = createStyle(restoredStyle);
    await styleSchema.parseAsync(styleResult);
  }
}

async function seedFeaturedStyles() {
  const existingStyles = await db
    .select()
    .from(style)
    .where(isNull(style.userId));

  const existingNames = new Set(existingStyles.map((s) => s.name));
  const missingStyles = DEFAULT_STYLES.filter(
    (featuredStyle) => !existingNames.has(featuredStyle.name),
  );

  if (missingStyles.length === 0) {
    console.log(
      "All featured styles already exist for this user. Skipping creation.",
    );
    return [];
  }

  const stylesToInsert = missingStyles.map((featuredStyle) => ({
    ...featuredStyle,
    isFeatured: true,
  }));

  const insertedStyles = await db
    .insert(style)
    .values(stylesToInsert)
    .returning();

  console.log(`✨ Created ${insertedStyles.length} missing featured styles`);
  return insertedStyles;
}

async function seed() {
  console.log("Seeding database...");

  try {
    console.log("Validating styles...");
    await validateDefaultStyles();
    const insertedStyles = await seedFeaturedStyles();

    console.log("Seeding complete!");
    console.log(`Inserted styles: ${insertedStyles.length}`);

    insertedStyles.forEach((style) => {
      console.log(` - ${style.name}`);
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void seed();
}

export { seed };
