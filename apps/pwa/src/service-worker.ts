/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

import { DocumentService } from '@hai/document-service';
import {
  buildResponse, DocumentDeleteResponseMessage, DocumentUpdateResponseMessage
} from './message-interface';

declare let self: ServiceWorkerGlobalScope

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

interface MessageHandler {
  handleMessage(event: ExtendableMessageEvent): Promise<void>;
}

let serviceRoot: MessageHandler | null = null;

self.addEventListener('activate', async (event) => {
  console.log('Service Worker activating...');
  const preload = async () => {
    serviceRoot = await startServiceRoot();
    console.log('Service composition root preloaded during activation.');
  };
  event.waitUntil(preload());
});

self.addEventListener('message', async (event: ExtendableMessageEvent) => {
  console.log('Service Worker received message:', event);

  if (!event.data || !event.data.type) return;

  // if ((event.data.type === "SetupNotificationChannel" || event.data.type === "KeepAlive")) return;

  if (serviceRoot) {
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
  // TODO: fake Initialize domain classes, repositories, and other dependencies
  // const db = await initializeDatabase(); // e.g., lovefield or custom IndexedDB abstraction
  // const repository = new MyRepository(db);
  // const service = new MyBackendService(repository); // Backend service depends on repository
  const service = new DocumentService();
  return {
    handleMessage: createBackendMessageHandler(service)
  };
}

function createBackendMessageHandler(service: DocumentService) {
  return async (event: ExtendableMessageEvent) => {
    console.log('Handling message:', event.data);

    const req = event.data;

    // TODO: move this into a router, which then invokes a controller
    if (req.type === 'Document.List') {
      /**
       * This is done by a controller function, which would
       * - check the payload
       * - transform the payload to objects used in the service
       * - call one or more services
       * - if, correlation ID is provided, respond back
       */
      // controller start
      const documents = await service.getDocuments();
      // const res = {foo: "bar"}
      const res = buildResponse(
        'Document.List.Response', 'success', {
          payload: { documents }
        }
      );
      // controller end
      // back here in web worker
      event.ports[0].postMessage(res);
    } else if (req.type === 'Document.Create') {
      const document = await service.createDocument(req.payload.content);
      const res = buildResponse(
        'Document.Create.Response', 'success', {
          payload: document
        }
      )
      event.ports[0].postMessage(res);
    } else if (req.type === 'Document.Update') {
      const {id, content} = req.payload;
      await service.updateDocument(id, content);

      // const res = buildResponse(
      //   'Document.Update.Response', 'success'
      // );
      // event.ports[0].postMessage(res);

      const {correlationId} = req.metadata;

      if (!event.source) {
        console.error('event.source is null. Unable to respond to the message.');
        return; // Stop execution if event.source is null
      }

      const res: DocumentUpdateResponseMessage = buildResponse(
        'Document.Update.Response', 'success', {
          correlationId
        }
      )
      // Post the response back to the client
      event.source.postMessage(res);
    }

    else if (req.type === 'Document.Delete') {
      const {id} = req.payload;
      await service.deleteDocument(id);

      const {correlationId} = req.metadata;

      if (!event.source) {
        console.error('event.source is null. Unable to respond to the message.');
        return; // Stop execution if event.source is null
      }

      const res: DocumentDeleteResponseMessage = buildResponse(
        "Document.Delete.Response", "success", {
          correlationId
        }
      )
      // Post the response back to the client
      event.source.postMessage(res);
    }
  };
}

// Timeout threshold for detecting inactivity (e.g., 30 seconds)
const INACTIVITY_TIMEOUT = 30000;

// Updated notificationChannels with last activity timestamp
const notificationChannels = new Map<string, { port: MessagePort; lastActive: number }>();

// Function to send broadcast notifications
let broadcastInterval: number | null = null;

function startBroadcasting() {
  if (broadcastInterval) return; // Avoid multiple intervals
  broadcastInterval = setInterval(() => {
    const message = `Hello! This message was sent at ${new Date().toLocaleTimeString()}`;
    broadcastNotification(message);

    // Cleanup inactive clients
    clearInactiveClients();
  }, 5000); // Broadcast every 5 seconds
}

function stopBroadcasting() {
  if (broadcastInterval) {
    clearInterval(broadcastInterval);
    broadcastInterval = null;
    console.log("Broadcasting stopped as there are no active clients.");
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
        type: "Notification",
        payload: { clientId, message },
      });
      console.log(`Notification sent to client ID: ${clientId}`);
    } catch (error) {
      console.error(`Failed to send notification to client ID ${clientId}:`, error);

      // Remove the client if its port is invalid or closed
      notificationChannels.delete(clientId);
      console.log(`Removed client ID ${clientId} due to communication failure.`);
    }
  }
}

function clearInactiveClients() {
  const now = Date.now();
  for (const [clientId, channel] of notificationChannels.entries()) {
    if (now - channel.lastActive > INACTIVITY_TIMEOUT) {
      console.log(`Client ID ${clientId} has been inactive for too long and will be removed.`);
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

  if ((event.data.type !== "SetupNotificationChannel" || event.data.type !== "KeepAlive")) return;

  const { type, clientId } = event.data;

  if (type === "SetupNotificationChannel" && event.ports[0]) {
    console.log(`Received SetupNotificationChannel request from client ID: ${clientId}`);
    const port = event.ports[0]; // Extract port2 from MessageChannel

    // Use the provided clientId
    if (!clientId) {
      console.error("Client ID is required for setting up a notification channel.");
      return;
    }

    // Store the MessagePort along with the last active timestamp
    notificationChannels.set(clientId, { port, lastActive: Date.now() });

    console.log(`Notification channel setup for client ID: ${clientId}`);

    // Send a confirmation response back to the client
    port.postMessage({ type: "NotificationChannelReady", clientId });

    // Start broadcasting if not already started
    startBroadcasting();
  } else if (type === "KeepAlive") {
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