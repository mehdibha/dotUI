import { eq } from "drizzle-orm";

import { createStyle } from "@dotui/registry/__style-system__/core";
import {
  styleDefinitionSchema,
  styleSchema,
} from "@dotui/registry/__style-system__/schemas";

import { db } from "./client";
import { DEFAULT_STYLES } from "./constants";
import { style, user } from "./schemas";

async function validateDefaultStyles() {
  for (const style of DEFAULT_STYLES) {
    await styleDefinitionSchema.parseAsync(style);
    const styleResult = createStyle(style);
    await styleSchema.parseAsync(styleResult);
  }
}

async function findOrCreateUser() {
  const email = "hello@mehdibha.com";

  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    const userRecord = existingUser[0];
    if (!userRecord) {
      throw new Error("User record is undefined");
    }
    console.log(`Found existing user: ${userRecord.name} (${email})`);
    return userRecord;
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name: "Mehdi Ben Hadj Ali",
    email,
    emailVerified: true,
    username: "mehdibha",
    image: "https://github.com/mehdibha.png",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createdUsers = await db.insert(user).values(newUser).returning();

  const createdUser = createdUsers[0];
  if (!createdUser) {
    throw new Error("Failed to create user");
  }

  console.log(`👤 Created new user: ${createdUser.name} (${email})`);
  return createdUser;
}

async function seedFeaturedStyles(userId: string) {
  const existingStyles = await db
    .select()
    .from(style)
    .where(eq(style.userId, userId));

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
    userId,
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
    const userRecord = await findOrCreateUser();
    const insertedStyles = await seedFeaturedStyles(userRecord.id);

    console.log("Seeding complete!");
    console.log(`User: ${userRecord.name} (${userRecord.email})`);
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
