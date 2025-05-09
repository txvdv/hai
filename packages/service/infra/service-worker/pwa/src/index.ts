/// <reference lib="webworker" />
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist })
);

self.skipWaiting();
clientsClaim();

self.addEventListener('activate', async (event) => {
  console.log('Service Worker activating...');
  const preload = async () => {
    console.log('Service Worker loaded.');
  };
  event.waitUntil(preload());
});

self.addEventListener('message', async (event: ExtendableMessageEvent) => {
  console.log('Service Worker received message:', event);

  if (!event.source) {
    console.error('event.source is null. Unable to respond to the message.');
    return; // Stop execution if event.source is null
  }

  const message = event.data;

  // Process the message based on the action
  if (message && message.action === 'hello') {
    // Send a more detailed response for our AboutView button
    event.source.postMessage({
      status: 'success',
      message: 'Message received by the background script module!',
      receivedData: message.data,
      timestamp: new Date().toISOString(),
      sender: 'Unknown source',
    });
  } else {
    // Default response for other messages
    event.source.postMessage({
      status: 'received',
      timestamp: new Date().toISOString(),
    });
  }
});
