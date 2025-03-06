/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

console.log("claims loaded")

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

let allowlist: undefined | RegExp[]
if (import.meta.env.DEV)
  allowlist = [/^\/$/]

// to allow work offline
registerRoute(new NavigationRoute(
  createHandlerBoundToURL('index.html'),
  { allowlist },
))

self.skipWaiting()
clientsClaim()

// Add custom message handling (e.g., dynamic calls like getDocuments)
self.addEventListener('message', async (event: ExtendableMessageEvent) => {
  console.log(
    `Message event`, event);
  if (!event.data || !event.data.type) return;

  switch (event.data.type) {
    case 'GET_DOCUMENTS': {
      console.log('Handling GET_DOCUMENTS message');
      try {
        const documents = await fetchDocuments();
        console.log('Fetched documents:', documents); // Add this
        event.ports[0].postMessage({ type: 'DOCUMENTS_RESPONSE', documents });
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
      break;
    }
    default:
      console.warn(`Unhandled message type: ${event.data.type}`);
  }
});

async function fetchDocuments(): Promise<Array<string>> {
  // Fetch documents dynamically from some API as an example
  return ['doc1', 'doc2', 'doc3'];
}
