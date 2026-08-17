import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = './src/assets/images';
const outDir = './public/charms';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function processImage(filename: string, outName: string) {
  const inputPath = path.join(srcDir, filename);
  const outputPath = path.join(outDir, outName);

  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // We want to create an RGBA buffer where the dark background is transparent
  const outBuffer = Buffer.alloc(width * height * 4);

  // Background thresholding with soft feathering
  // Sample background brightness from corners
  const samplePixels: number[] = [];
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const brightness = Math.max(r, g, b);
      samplePixels.push(brightness);
    }
  }
  samplePixels.sort((a, b) => a - b);
  const bgBrightness = samplePixels[Math.floor(samplePixels.length * 0.75)] || 25;
  const thresholdLow = Math.max(18, bgBrightness + 5);
  const thresholdHigh = thresholdLow + 30;

  console.log(`Processing ${filename}: bgBrightness ~ ${bgBrightness}, thresholdLow=${thresholdLow}, thresholdHigh=${thresholdHigh}`);

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    const dstIdx = i * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    const maxVal = Math.max(r, g, b);

    let alpha = 255;
    if (maxVal <= thresholdLow) {
      alpha = 0;
    } else if (maxVal < thresholdHigh) {
      alpha = Math.round(((maxVal - thresholdLow) / (thresholdHigh - thresholdLow)) * 255);
    }

    // Color de-blacking to prevent dark halos on semi-transparent edge pixels
    let finalR = r;
    let finalG = g;
    let finalB = b;
    if (alpha > 0 && alpha < 255) {
      const factor = 255 / alpha;
      finalR = Math.min(255, Math.round(r * factor));
      finalG = Math.min(255, Math.round(g * factor));
      finalB = Math.min(255, Math.round(b * factor));
    }

    outBuffer[dstIdx] = finalR;
    outBuffer[dstIdx + 1] = finalG;
    outBuffer[dstIdx + 2] = finalB;
    outBuffer[dstIdx + 3] = alpha;
  }

  await sharp(outBuffer, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath);

  console.log(`Saved transparent charm to ${outputPath}`);
}

async function run() {
  const files = fs.readdirSync(srcDir);
  for (const f of files) {
    if (f.includes('star')) await processImage(f, 'star.png');
    if (f.includes('heart')) await processImage(f, 'heart.png');
    if (f.includes('letter_a')) await processImage(f, 'initial_a.png');
    if (f.includes('flower')) await processImage(f, 'flower.png');
    if (f.includes('crane')) await processImage(f, 'crane.png');
    if (f.includes('laptop')) await processImage(f, 'laptop.png');
  }
}

run().catch(console.error);
