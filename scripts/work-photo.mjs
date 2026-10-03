#!/usr/bin/env node
/**
 * Prepare one of Mayfair's own site photos for src/assets/images/work/.
 *
 *   node scripts/work-photo.mjs <in> <out.jpg> [--crop x,y,w,h]
 *
 * Correction only — nothing is added or removed from the picture:
 *   - optional crop (crop bystanders and number plates out rather than blurring them)
 *   - half-strength grey-world white balance, capped at ±10% per channel
 *   - gentle levels stretch, +5% saturation, light sharpening
 * Never upscales. WhatsApp "Photo" sends are compressed to ~1280px; ask for
 * files sent as "Document" to keep full resolution.
 */
import sharp from "sharp";

const [input, output, ...rest] = process.argv.slice(2);
if (!input || !output) {
  console.error("usage: node scripts/work-photo.mjs <in> <out.jpg> [--crop x,y,w,h]");
  process.exit(1);
}
const cropArg = rest[rest.indexOf("--crop") + 1];
const crop = rest.includes("--crop") ? cropArg.split(",").map(Number) : null;

let img = sharp(input).rotate();
if (crop) {
  const [left, top, width, height] = crop;
  img = img.extract({ left, top, width, height });
}
const base = await img.removeAlpha().toBuffer();

const { channels } = await sharp(base).stats();
const means = channels.slice(0, 3).map((c) => c.mean);
const grey = means.reduce((a, b) => a + b) / 3;
const gains = means.map((m) => Math.min(1.1, Math.max(0.9, 1 + 0.5 * (grey / m - 1))));

await sharp(base)
  .linear(gains, [0, 0, 0])
  .normalise({ lower: 0.5, upper: 99.6 })
  .modulate({ saturation: 1.05 })
  .sharpen({ sigma: 0.6, m1: 0.4, m2: 1.2 })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(output);

console.log(output, "gains", gains.map((g) => g.toFixed(3)).join(" "));
