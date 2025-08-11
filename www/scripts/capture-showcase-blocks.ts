import { existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import sharp from "sharp";

import { buildTimeCaller } from "../lib/trpc/build";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WWW_DIR = path.join(__dirname, "..");
const TARGET_PATH = path.join(WWW_DIR, "public/images/showcase");

// ----------------------------------------------------------------------------
// Capture screenshots.
// ----------------------------------------------------------------------------
async function captureScreenshots() {
  const featuredStyles = await buildTimeCaller.style.getFeatured({});

  if (!existsSync(TARGET_PATH)) {
    mkdirSync(TARGET_PATH, { recursive: true });
  }

  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 800,
      height: 900,
    },
  });

  for (const style of featuredStyles) {
    const pageUrl = `http://localhost:3000/block-view/${style.user.username}/${style.name}/blocks-showcase`;

    const page = await browser.newPage();
    await page.goto(pageUrl, {
      waitUntil: "networkidle2",
    });

    console.log(`- Capturing ${style.name}...`);

    for (const theme of ["light", "dark"]) {
      const screenshotPath = path.join(
        TARGET_PATH,
        `${style.name}-${theme}.png`,
      );

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

      // Take screenshot as buffer (full page), then crop with sharp and save
      const buffer = await page.screenshot({
        type: "png",
        fullPage: true,
      });

      const img = sharp(buffer as Buffer);
      const meta = await img.metadata();

      if (!meta.width || !meta.height) {
        throw new Error("Failed to read screenshot dimensions");
      }

      const cropWidth = 30; // pixels on each side
      const cropHeight = 40; // pixels on each side
      const width = Math.max(1, meta.width - cropWidth * 2);
      const height = Math.max(1, meta.height - cropHeight * 2);

      await img
        .extract({ left: cropWidth, top: cropHeight, width, height })
        .toFile(screenshotPath as `${string}.png`);
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
