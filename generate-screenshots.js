const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const websites = [
  { url: "https://www.dandggardening.com/", filename: "j.png" },
  {
    url: "https://www.orlandosjunkremoval.com",
    filename: "orlandosjunkremoval.png",
  },
  {
    url: "https://www.professionalcarpetcleaningsacramento.com/",
    filename: "h.png",
  },
  { url: "https://lawn-services-llc.vercel.app/", filename: "g.png" },
  { url: "https://www.alwaysdiamondlimo.com/", filename: "d.png" },
  { url: "https://www.khaosparrish.com/", filename: "b.png" },
  { url: "https://www.vanityhabit.com/", filename: "c.png" },
  { url: "https://calihouseinc.com/", filename: "e.png" },
  { url: "https://www.ourmusicevents.com/", filename: "f.png" },
];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const site of websites) {
    console.log(`Capturing ${site.url}...`);
    try {
      await page.goto(site.url, { waitUntil: "networkidle2", timeout: 60000 });
      await page.setViewport({ width: 1200, height: 800 });
      const filePath = path.join(__dirname, "public", "img", site.filename);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved: ${site.filename}`);
    } catch (err) {
      console.error(`❌ Failed to capture ${site.url}: ${err.message}`);
    }
  }

  await browser.close();
})();
