import { eq } from "drizzle-orm";

import { db } from "./client";
import { style, user } from "./schema";

interface DefaultStyle {
  name: string;
  description: string;
  iconLibrary: string;
  fonts: Record<string, string> | null;
  variants: Record<string, string> | null;
}

const DEFAULT_STYLES: DefaultStyle[] = [
  {
    name: "minimalist",
    description: "Default style",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    variants: {
      button: "basic",
    },
  },
];

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
  const existingFeaturedStyles = await db
    .select()
    .from(style)
    .where(eq(style.isFeatured, true))
    .limit(1);

  if (existingFeaturedStyles.length > 0) {
    console.log("ℹ️  Featured styles already exist. Skipping creation.");
    return existingFeaturedStyles;
  }

  const stylesToInsert = DEFAULT_STYLES.map((featuredStyle) => ({
    ...featuredStyle,
    userId,
    isFeatured: true,
  }));

  const insertedStyles = await db
    .insert(style)
    .values(stylesToInsert)
    .returning();

  console.log(`✨ Created ${insertedStyles.length} featured styles`);
  return insertedStyles;
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
