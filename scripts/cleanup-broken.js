const fs = require("fs");
const path = require("path");

const portfolioDir = path.join(__dirname, "..", "public", "portfolio");

if (!fs.existsSync(portfolioDir)) {
  console.error("❌ Directory not found:", portfolioDir);
  process.exit(1);
}

const files = fs.readdirSync(portfolioDir);

let deleted = 0;

files.forEach((file) => {
  const filePath = path.join(portfolioDir, file);
  const stats = fs.statSync(filePath);

  // Delete .png files smaller than 15KB (usually failed screenshots)
  if (file.endsWith(".png") && stats.size < 15 * 1024) {
    fs.unlinkSync(filePath);
    console.log("🗑️ Deleted:", file);
    deleted++;
  }
});

if (deleted === 0) {
  console.log("✅ No broken images found.");
} else {
  console.log(`✅ Finished. ${deleted} broken image(s) removed.`);
}
