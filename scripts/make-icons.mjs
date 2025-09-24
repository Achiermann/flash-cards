import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve('public/flashCardsLogo.png');
const outDir = path.resolve('public/icons');
fs.mkdirSync(outDir, { recursive: true });

const sizes = [192, 512];
await Promise.all(sizes.map(async (s) => {
  const out = path.join(outDir, `icon-${s}.png`);
  await sharp(src).resize(s, s, { fit: 'cover' }).png().toFile(out);
  console.log('Wrote', out);
}));
