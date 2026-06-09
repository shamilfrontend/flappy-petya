import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.resolve(scriptDir, '../public/static');

async function convertPngToWebp(fileName) {
  const pngPath = path.join(staticDir, fileName);
  const webpPath = path.join(staticDir, fileName.replace(/\.png$/i, '.webp'));
  const input = await readFile(pngPath);

  await sharp(input)
    .webp({ quality: 85 })
    .toFile(webpPath);

  console.log(`Converted ${fileName} -> ${path.basename(webpPath)}`);
}

const files = await readdir(staticDir);
const pngFiles = files.filter((file) => file.endsWith('.png'));

await Promise.all(pngFiles.map((file) => convertPngToWebp(file)));
