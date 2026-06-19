import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "../public/icons");

const sizes = [180, 192, 512];

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#b45309"/>
  <rect x="72" y="120" width="368" height="272" rx="40" fill="#fff7ed"/>
  <rect x="96" y="156" width="320" height="44" rx="16" fill="#f59e0b"/>
  <rect x="96" y="220" width="320" height="36" rx="14" fill="#fcd34d"/>
  <rect x="96" y="276" width="320" height="36" rx="14" fill="#ef4444" opacity="0.85"/>
  <rect x="96" y="332" width="320" height="36" rx="14" fill="#fcd34d"/>
</svg>
`;

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

for (const size of sizes) {
  const filename =
    size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`;
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(iconsDir, filename));
}

console.log("Generated PWA icons");
