// This script copies the necessary files for the Chrome extension to the dist directory
// and creates placeholder icons

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const iconsDir = path.resolve(distDir, 'icons');
const sourceIconsDir = path.resolve(rootDir, 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Copy manifest.json to dist directory
const manifestPath = path.resolve(rootDir, 'manifest.json');
const manifestDistPath = path.resolve(distDir, 'manifest.json');
fs.copyFileSync(manifestPath, manifestDistPath);
console.log('Copied manifest.json to dist directory');

// Copy icons from source directory or create placeholders if they don't exist
const iconSizes = [16, 48, 128];
for (const size of iconSizes) {
  const sourceIconPath = path.resolve(sourceIconsDir, `icon${size}.png`);
  const destIconPath = path.resolve(iconsDir, `icon${size}.png`);

  if (fs.existsSync(sourceIconPath)) {
    // Copy the icon from the source directory
    fs.copyFileSync(sourceIconPath, destIconPath);
    console.log(`Copied icon: icon${size}.png`);
  } else {
    // Create a placeholder if the icon doesn't exist
    fs.writeFileSync(destIconPath, '');
    console.log(`Created placeholder icon: icon${size}.png (source icon not found)`);
  }
}

// Copy the transpiled service worker from the packages/service/infra/service-worker/crx/dist directory
const serviceWorkerSourcePath = path.resolve(rootDir, '../../packages/service/infra/service-worker/crx/dist/index.js');
const serviceWorkerDestPath = path.resolve(distDir, 'service-worker.js');

if (fs.existsSync(serviceWorkerSourcePath)) {
  fs.copyFileSync(serviceWorkerSourcePath, serviceWorkerDestPath);
  console.log('Copied service-worker.js from packages/service/infra/service-worker/crx/dist/index.js');
} else {
  console.error('Error: Service worker source file not found at', serviceWorkerSourcePath);
  process.exit(1);
}

console.log('Extension files copied successfully!');
