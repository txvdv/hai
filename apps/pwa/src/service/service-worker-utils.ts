export async function waitForServiceWorkerController(
  timeoutInMs = 10000
): Promise<ServiceWorker> {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator)) {
      reject(new Error('Service workers are not supported.'));
      return;
    }

    if (navigator.serviceWorker.controller) {
      // Service worker controller is already available
      resolve(navigator.serviceWorker.controller);
      return;
    }

    // Prepare a timeout to avoid indefinite waiting
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(
        new Error(
          `Timeout of ${timeoutInMs}ms waiting for service worker controller.`
        )
      );
    }, timeoutInMs);

    // Listener for the 'controllerchange' event
    function onControllerChange() {
      if (navigator.serviceWorker.controller) {
        cleanup();
        resolve(navigator.serviceWorker.controller);
      }
    }

    // Cleanup function to remove event listeners and clear timeout
    function cleanup() {
      clearTimeout(timeoutId);
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange
      );
    }

    // Add the listener for 'controllerchange'
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      onControllerChange
    );

    // Handle service worker readiness errors or rejections
    navigator.serviceWorker.ready
      .then(() => {})
      .catch((err) => {
        cleanup();
        reject(err);
      });
  });
}
