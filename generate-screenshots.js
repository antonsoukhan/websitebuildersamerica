// Old
// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";

// ✅ New (CommonJS syntax)
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const websites = [
  {
    url: "https://www.orlandosjunkremoval.com",
    filename: "orlandosjunkremoval.png",
  },
  // Add more as needed
];

const outputDir = path.resolve("public/img");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set your desired viewport size (simulates desktop screen)
  await page.setViewport({ width: 1280, height: 800 });

  for (const site of websites) {
    console.log(`Capturing ${site.url}...`);

    await page.goto(site.url, { waitUntil: "networkidle2", timeout: 0 });

    const imagePath = path.join(outputDir, site.filename);

    await page.screenshot({
      path: imagePath,
      fullPage: false, // ← This makes it capture only the viewport, not the full page
    });

    console.log(`Saved screenshot to ${imagePath}`);
  }

  await browser.close();
})();
