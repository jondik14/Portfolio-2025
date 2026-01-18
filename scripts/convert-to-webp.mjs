import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename, dirname, resolve } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Get the Portfolio-2025-main directory (parent of scripts/)
const projectRoot = resolve(__dirname, '..');

const TARGET_FOLDERS = [
  join(projectRoot, 'assets'),
  join(projectRoot, 'framerusercontent.com'),
  join(projectRoot, 'reading-room', 'Book covers')
];

const CONVERT_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const SKIP_EXTENSIONS = ['.svg', '.gif', '.mp4', '.webp'];

let converted = 0;
let skipped = 0;
let errors = 0;
const errorList = [];

function shouldConvert(filePath) {
  const ext = extname(filePath).toLowerCase();
  return CONVERT_EXTENSIONS.includes(ext);
}

function shouldSkip(filePath) {
  const ext = extname(filePath).toLowerCase();
  return SKIP_EXTENSIONS.includes(ext);
}

async function convertImage(inputPath, outputPath) {
  try {
    const ext = extname(inputPath).toLowerCase();
    const options = {
      quality: 80
    };

    // Keep transparency for PNGs
    if (ext === '.png') {
      options.lossless = false;
    }

    await sharp(inputPath)
      .webp(options)
      .toFile(outputPath);

    return true;
  } catch (error) {
    errorList.push({ file: inputPath, error: error.message });
    return false;
  }
}

async function processDirectory(dirPath) {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Recursively process subdirectories
        await processDirectory(fullPath);
      } else if (entry.isFile()) {
        if (shouldSkip(fullPath)) {
          continue;
        }

        if (shouldConvert(fullPath)) {
          const outputPath = join(
            dirPath,
            basename(fullPath, extname(fullPath)) + '.webp'
          );

          // Skip if .webp already exists
          if (existsSync(outputPath)) {
            skipped++;
            continue;
          }

          const success = await convertImage(fullPath, outputPath);
          if (success) {
            converted++;
          } else {
            errors++;
          }
        }
      }
    }
  } catch (error) {
    errorList.push({ file: dirPath, error: error.message });
    errors++;
  }
}

async function main() {
  console.log('Starting WebP conversion...\n');

  for (const folder of TARGET_FOLDERS) {
    try {
      const stats = await stat(folder);
      if (stats.isDirectory()) {
        console.log(`Processing: ${folder}`);
        await processDirectory(folder);
      } else {
        console.log(`Skipping (not a directory): ${folder}`);
      }
    } catch (error) {
      console.log(`Error accessing ${folder}: ${error.message}`);
      errorList.push({ file: folder, error: error.message });
      errors++;
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('Conversion Summary:');
  console.log('='.repeat(50));
  console.log(`Converted: ${converted}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Errors: ${errors}`);

  if (errorList.length > 0) {
    console.log('\nError Details:');
    errorList.forEach(({ file, error }) => {
      console.log(`  - ${file}: ${error}`);
    });
  }

  console.log('\nDone!');
}

main().catch(console.error);
