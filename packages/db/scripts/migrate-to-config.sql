-- Migration script: Migrate from theme/icons/variants columns to single config column
-- Run this BEFORE applying the Drizzle migration if you have existing data
-- Usage: psql $DATABASE_URL -f migrate-to-config.sql

-- Step 1: Add new columns if they don't exist
ALTER TABLE "style" ADD COLUMN IF NOT EXISTS "config" jsonb;
ALTER TABLE "style" ADD COLUMN IF NOT EXISTS "is_preset" boolean DEFAULT false;

-- Step 2: Migrate data from old columns to new config column
-- Also transforms typography from {heading, body, mono} to {font}
UPDATE "style"
SET "config" = jsonb_build_object(
  'theme', jsonb_set(
    "theme",
    '{typography}',
    jsonb_build_object(
      'font', COALESCE("theme"->'typography'->>'body', "theme"->'typography'->>'heading', 'Inter')
    )
  ),
  'icons', "icons",
  'variants', "variants"
)
WHERE "config" IS NULL
  AND "theme" IS NOT NULL;

-- Step 3: Make config NOT NULL after migration
ALTER TABLE "style" ALTER COLUMN "config" SET NOT NULL;
ALTER TABLE "style" ALTER COLUMN "is_preset" SET NOT NULL;

-- Step 4: Drop old columns
ALTER TABLE "style" DROP COLUMN IF EXISTS "theme";
ALTER TABLE "style" DROP COLUMN IF EXISTS "icons";
ALTER TABLE "style" DROP COLUMN IF EXISTS "variants";

-- Verify migration
SELECT id, name, config->'theme'->'typography' as typography FROM "style" LIMIT 5;
