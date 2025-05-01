// // TODO: WORKS for unidirectional messaging, but disabled until a good usecase is found
// navigator.serviceWorker.ready.then((registration) => {
//   const messageChannel = new MessageChannel();
//
//   // Listen for messages from the service worker
//   messageChannel.port1.onmessage = (event) => {
//     const { type, payload } = event.data || {};
//     if (type === "Notification") {
//       console.log(`Notification received: ${payload.message}`);
//     } else if (type === "NotificationChannelReady") {
//       console.log(`Notification channel ready for client ID: ${payload.clientId}`);
//     }
//   };
//
//   // Register the notification channel
//   const clientId = "unique-client-id-123";
//   registration.active?.postMessage(
//     { type: "SetupNotificationChannel", clientId },
//     [messageChannel.port2]
//   );
//
//   // Send periodic KeepAlive messages
//   setInterval(() => {
//     registration.active?.postMessage({
//       type: "KeepAlive",
//       clientId,
//     });
//   }, 10000); // Every 10 seconds
// });
