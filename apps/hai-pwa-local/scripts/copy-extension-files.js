import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const srcDir = path.resolve(rootDir, 'src');

// Copy the transpiled service worker from the packages/service/infra/service-worker/crx/dist directory
const serviceWorkerSourcePath = path.resolve(
  rootDir,
  '../../packages/service/infra/service-worker/pwa/dist/index.js'
);
const serviceWorkerDestPath = path.resolve(srcDir, 'sw.js');

if (fs.existsSync(serviceWorkerSourcePath)) {
  fs.copyFileSync(serviceWorkerSourcePath, serviceWorkerDestPath);
  console.log(
    'Copied sw.js from packages/service/infra/service-worker/pwa/dist/index.js'
  );
} else {
  console.error(
    'Error: Service worker source file not found at',
    serviceWorkerSourcePath
  );
  process.exit(1);
}

console.log('Extension files copied successfully!');
