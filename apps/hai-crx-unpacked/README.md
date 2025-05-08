# HAI Chrome Extension (Unpacked)

This is a Chrome extension built with Vue.js. The extension opens a new tab with the Vue application when clicked.

## Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Setup

1. Clone the repository
2. Navigate to the extension directory:
   ```
   cd apps/hai-crx-unpacked
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Development Server

Run the development server:

```
npm run dev
```

This will start a development server at http://localhost:4200.

### Building the Extension

Build the extension for production:

```
npm run build
```

This will:
1. Build the Vue application using Vite
2. Generate the service-worker.js file
3. Copy the manifest.json file to the dist directory
4. Create placeholder icons in the dist/icons directory

The built extension will be in the `dist` directory.

## Installing the Unpacked Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click "Load unpacked" and select the `dist` directory from this project
4. The extension should now be installed and visible in your Chrome toolbar

## Extension Structure

- `manifest.json`: Configuration file for the Chrome extension
- `src/service-worker.ts`: Background service worker for the extension
- `src/main.ts`: Entry point for the Vue application
- `src/app/`: Vue components
- `src/router/`: Vue Router configuration
- `src/views/`: Vue views/pages

## Adding Real Icons

The extension currently uses placeholder icons. To add real icons:

1. Create icon files in the following sizes: 16x16, 48x48, and 128x128 pixels
2. Place them in the `icons` directory with the names `icon16.png`, `icon48.png`, and `icon128.png`
3. Rebuild the extension

## Notes

- The service worker opens the index.html page in a new tab when the extension icon is clicked
- The extension requires the "tabs" permission to open new tabs