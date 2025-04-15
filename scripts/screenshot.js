const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const websites = [
  {
    url: "https://www.danshandymanservicestwincities.com/",
    name: "danshandymanservicestwincities_com_com",
  },
  {
    url: "https://www.blueladderdesignsconstruction.com/",
    name: "blueladderdesignsconstruction_com_com",
  },
  { url: "https://www.salondesimone.com/", name: "salondesimone_com_com" },
  { url: "https://www.jv-flooring.com/", name: "jv-flooring_com_com" },
  {
    url: "https://www.professionalweldingrepairs.com/",
    name: "professionalweldingrepairs_com_com",
  },
  {
    url: "https://www.jjplumbing-heating.com",
    name: "jjplumbing-heating_com_com",
  },
  {
    url: "https://www.essentialtreeservices.net/",
    name: "essentialtreeservices_net_com",
  },
  {
    url: "https://mcgarveyconstruction.com/",
    name: "mcgarveyconstruction_com_com",
  },
  { url: "https://www.503landscape.com/", name: "503landscape_com_com" },
  {
    url: "https://www.tonysprofessionaltreeservice.com/",
    name: "tonysprofessionaltreeservice_com_com",
  },
  { url: "https://www.ghgarchitects.com/", name: "ghgarchitects_com_com" },
  { url: "https://www.katalex.org/", name: "katalex_org_com" },
  {
    url: "https://www.jillscreativedesigns.com/",
    name: "jillscreativedesigns_com_com",
  },
  { url: "https://www.noahsacademy.com/", name: "noahsacademy_com_com" },
  {
    url: "https://www.faithfuldoorsolutions.com/",
    name: "faithfuldoorsolutions_com_com",
  },
  {
    url: "https://www.bigfoottinyhouse.com/",
    name: "bigfoottinyhouse_com_com",
  },
  {
    url: "https://www.bobslandscapingpondsandwaterfalls.com/",
    name: "bobslandscapingpondsandwaterfalls_com_com",
  },
];

const outputDir = path.join(process.cwd(), "public", "portfolio");

async function run() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const site of websites) {
    try {
      console.log(`📸 Capturing ${site.url}`);
      await page.goto(site.url, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });

      await page.setViewport({ width: 1280, height: 800 });

      // ✅ Wait for the first visible image to fully load
      await page.waitForSelector("img", { visible: true, timeout: 10000 });

      await page.evaluate(async () => {
        const firstImg = document.querySelector("img");
        if (firstImg && !firstImg.complete) {
          await new Promise((res) => {
            firstImg.onload = firstImg.onerror = res;
          });
        }
      });

      // ⏱ Give a little buffer time
      await new Promise((res) => setTimeout(res, 1000));

      const filePath = path.join(outputDir, `${site.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });

      console.log(`✅ Saved: ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed: ${site.url}`, err.message);
    }
  }

  await browser.close();
}

run();
