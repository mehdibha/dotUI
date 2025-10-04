import { existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

import { buildTimeCaller } from "../lib/trpc/build";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WWW_DIR = path.join(__dirname, "..");
const TARGET_PATH = path.join(WWW_DIR, "public/images/showcase");

// ----------------------------------------------------------------------------
// Capture screenshots.
// ----------------------------------------------------------------------------
async function captureScreenshots() {
  const featuredStyles = await buildTimeCaller.style.getPublicStyles({
    featured: true,
  });

  if (!existsSync(TARGET_PATH)) {
    mkdirSync(TARGET_PATH, { recursive: true });
  }

  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 800,
      height: 900,
      deviceScaleFactor: 2,
    },
  });

  for (const style of featuredStyles) {
    const pageUrl = `http://localhost:4444/view/${style.user.username}/${style.name}/cards?mode=true`;

    const page = await browser.newPage();
    await page.goto(pageUrl, {
      waitUntil: "networkidle2",
    });

    console.log(`- Capturing ${style.name}...`);

    for (const theme of ["light", "dark"]) {
      // Set theme and reload page
      await page.evaluate((currentTheme) => {
        localStorage.setItem(
          "user-preferences",
          `{"activeStyleId":null,"activeMode":"${currentTheme}"}`,
        );
      }, theme);

      await page.reload({ waitUntil: "networkidle2" });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Hide Tailwind indicator
      await page.evaluate(() => {
        const indicator = document.querySelector("[data-tailwind-indicator]");
        if (indicator) {
          indicator.remove();
        }
      });

      // Capture for both normal (1400) and mobile (800)
      const sizes: { width: number; suffix: string }[] = [
        { width: 1400, suffix: "" },
        { width: 800, suffix: "-mobile" },
      ];

      for (const { width: viewportWidth, suffix } of sizes) {
        await page.setViewport({ width: viewportWidth, height: 900 });
        await new Promise((resolve) => setTimeout(resolve, 500));

        const screenshotPath = path.join(
          TARGET_PATH,
          `${style.name}-${theme}${suffix}.png`,
        );

        await page.screenshot({
          path: screenshotPath as `${string}.png`,
          type: "png",
          fullPage: true,
        });
      }
    }

    await page.close();
  }

  await browser.close();
}

try {
  console.log("🔍 Capturing screenshots...");

  await captureScreenshots();

  console.log("✅ Done!");
} catch (error) {
  console.error(error);
  process.exit(1);
}
