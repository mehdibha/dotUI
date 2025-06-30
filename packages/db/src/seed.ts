import { eq } from "drizzle-orm";

import { db } from "./client";
import { DEFAULT_STYLES } from "./constants";
import { style, user } from "./schema";

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
    console.log(`👤 Found existing user: ${userRecord.name} (${email})`);
    return userRecord;
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name: "Mehdi Benhadjali",
    email,
    emailVerified: true,
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

  const existingSlugs = new Set(existingStyles.map((s) => s.slug));
  const missingStyles = DEFAULT_STYLES.filter(
    (featuredStyle) => !existingSlugs.has(featuredStyle.slug),
  );

  if (missingStyles.length === 0) {
    console.log(
      "ℹ️  All featured styles already exist for this user. Skipping creation.",
    );
    return existingStyles;
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
  return [...existingStyles, ...insertedStyles];
}

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const userRecord = await findOrCreateUser();
    const insertedStyles = await seedFeaturedStyles(userRecord.id);

    console.log("🎉 Seeding complete!");
    console.log(`   User: ${userRecord.name} (${userRecord.email})`);
    console.log(`   Featured Styles: ${insertedStyles.length}`);

    insertedStyles.forEach((style) => {
      console.log(`   - ${style.name}: ${style.description}`);
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
