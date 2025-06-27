import { db } from "./client";
import { Style } from "./schema";

const officialStyles: Omit<
  typeof Style.$inferInsert,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    name: "Minimalist",
    description: "A minimalist style",
    iconLibrary: "lucide",
    fonts: null,
    variants: null,
  },
  {
    name: "Brutalist",
    description: "A bold, brutalist design system",
    iconLibrary: "lucide",
    fonts: null,
    variants: {
      button: "brutalist",
      modal: "blur",
      tabs: "motion",
      tooltip: "motion",
    },
  },
  {
    name: "Remix Icons",
    description: "Using Remix Icons instead of Lucide",
    iconLibrary: "remix-icons",
    fonts: null,
    variants: null,
  },
];

async function seed() {
  console.log("🌱 Seeding database with official styles...");

  try {
    if (officialStyles.length === 0) {
      console.log(
        "ℹ️  No styles to seed. Add styles to the officialStyles array first.",
      );
      return;
    }

    await db.delete(Style);
    console.log("✅ Cleared existing styles");

    const result = await db.insert(Style).values(officialStyles).returning();
    console.log(`✅ Inserted ${result.length} official styles:`);

    result.forEach((style) => {
      console.log(`   - ${style.name}: ${style.description}`);
    });

    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed();
}

export { seed, officialStyles };
