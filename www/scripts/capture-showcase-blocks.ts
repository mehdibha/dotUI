import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

import { buildTimeCaller } from "../lib/trpc/build";

const OUTPUT_DIR = path.join(process.cwd(), "public/images/showcase");

// ----------------------------------------------------------------------------
// Capture screenshots.
// ----------------------------------------------------------------------------
async function captureScreenshots() {
  const featuredStyles = await buildTimeCaller.style.getPublicStyles({
    featured: true,
  });

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
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
          OUTPUT_DIR,
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
