/// <reference lib="webworker" />
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import type { AppService } from '@hai/service-web';
import { getAppService } from '@hai/service-web';

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

let serviceRoot: MessageHandler | null = null;
interface MessageHandler {
  handleMessage(event: ExtendableMessageEvent): Promise<void>;
}

let appService: AppService | null = null;

self.addEventListener('activate', async (event) => {
  console.log('Service Worker activating...');
  const preload = async () => {
    appService = getAppService();
    await appService.startup();

    serviceRoot = await startServiceRoot();
    console.log('Service composition root preloaded during activation.');
  };
  event.waitUntil(preload());
});

self.addEventListener('message', async (event: ExtendableMessageEvent) => {
  console.log('Service Worker received message:', event);

  if (!event.data || !event.data.type) return;

  if (
    event.data.type === 'SetupNotificationChannel' ||
    event.data.type === 'KeepAlive'
  )
    return;

  if (appService && serviceRoot) {
    console.log('Service Worker serviceRoot detected. Handling message...');
    try {
      return await serviceRoot.handleMessage(event);
    } catch (error) {
      console.error(error);
    }
  }

  console.warn(`Unhandled message type: ${event.data.type}`);
});

async function startServiceRoot() {
  return {
    handleMessage: createBackendMessageHandler(),
  };
}

function createBackendMessageHandler() {
  return async (event: ExtendableMessageEvent) => {
    if (appService === null) {
      console.error(
        'App Service not running. Unable to respond to the message.'
      );
      return; // Stop execution if event.source is null
    }

    if (!event.source) {
      console.error('event.source is null. Unable to respond to the message.');
      return; // Stop execution if event.source is null
    }

    const msg = event.data;
    console.log('Message:', msg);
    let resMsg = await appService.handleMessageAsync(msg);
    console.log('Message Response:', resMsg);
    event.source.postMessage(resMsg);
  };
}

// Timeout threshold for detecting inactivity (e.g., 30 seconds)
const INACTIVITY_TIMEOUT = 30000;

// Updated notificationChannels with last activity timestamp
const notificationChannels = new Map<
  string,
  { port: MessagePort; lastActive: number }
>();

// Function to send broadcast notifications
let broadcastInterval: number | null = null;

function startBroadcasting() {
  if (broadcastInterval) return; // Avoid multiple intervals
  broadcastInterval = setInterval(() => {
    const message = `Hello! This message was sent at ${new Date().toLocaleTimeString()}`;
    broadcastNotification(message);

    // Cleanup inactive clients
    clearInactiveClients();
  }, 5000) as unknown as number; // Broadcast every 5 seconds
}

function stopBroadcasting() {
  if (broadcastInterval) {
    clearInterval(broadcastInterval);
    broadcastInterval = null;
    console.log('Broadcasting stopped as there are no active clients.');
  }
}

// Send notifications to all active clients
function broadcastNotification(message: string) {
  if (notificationChannels.size === 0) {
    // Stop broadcasting if there are no active clients
    stopBroadcasting();
    return;
  }

  for (const [clientId, { port }] of notificationChannels.entries()) {
    try {
      port.postMessage({
        type: 'Notification',
        payload: { clientId, message },
      });
      console.log(`Notification sent to client ID: ${clientId}`);
    } catch (error) {
      console.error(
        `Failed to send notification to client ID ${clientId}:`,
        error
      );

      // Remove the client if its port is invalid or closed
      notificationChannels.delete(clientId);
      console.log(
        `Removed client ID ${clientId} due to communication failure.`
      );
    }
  }
}

function clearInactiveClients() {
  const now = Date.now();
  for (const [clientId, channel] of notificationChannels.entries()) {
    if (now - channel.lastActive > INACTIVITY_TIMEOUT) {
      console.log(
        `Client ID ${clientId} has been inactive for too long and will be removed.`
      );
      notificationChannels.delete(clientId);
    }
  }

  // Stop broadcasting if no active clients remain
  if (notificationChannels.size === 0) {
    stopBroadcasting();
  }
}

self.addEventListener('message', async (event: ExtendableMessageEvent) => {
  console.log('Service Worker received message:', event);

  if (!event.data || !event.data.type) return;

  if (
    event.data.type !== 'SetupNotificationChannel' ||
    event.data.type !== 'KeepAlive'
  )
    return;

  const { type, clientId } = event.data;

  if (type === 'SetupNotificationChannel' && event.ports[0]) {
    console.log(
      `Received SetupNotificationChannel request from client ID: ${clientId}`
    );
    const port = event.ports[0]; // Extract port2 from MessageChannel

    // Use the provided clientId
    if (!clientId) {
      console.error(
        'Client ID is required for setting up a notification channel.'
      );
      return;
    }

    // Store the MessagePort along with the last active timestamp
    notificationChannels.set(clientId, { port, lastActive: Date.now() });

    console.log(`Notification channel setup for client ID: ${clientId}`);

    // Send a confirmation response back to the client
    port.postMessage({ type: 'NotificationChannelReady', clientId });

    // Start broadcasting if not already started
    startBroadcasting();
  } else if (type === 'KeepAlive') {
    // Update last active timestamp for the client
    if (clientId && notificationChannels.has(clientId)) {
      const channel = notificationChannels.get(clientId);
      if (channel) {
        channel.lastActive = Date.now();
        console.log(`KeepAlive received from client ID: ${clientId}`);
      }
    }
  } else {
    console.warn(`Unhandled message type: ${type}`);
  }
});
