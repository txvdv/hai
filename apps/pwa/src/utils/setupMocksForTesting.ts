import { vi } from 'vitest';
import { MockProxy, mock } from 'vitest-mock-extended';

export let mockServiceWorkerController: MockProxy<ServiceWorker>;
export let mockServiceWorker: MockProxy<ServiceWorkerContainer>;

vi.stubGlobal('navigator', {
  serviceWorker: {
    get controller() {
      return mockServiceWorkerController;
    },
    get ready() {
      return Promise.resolve(mockServiceWorkerController);
    },
  },
});

mockServiceWorkerController = mock<ServiceWorker>();
mockServiceWorker = mock<ServiceWorkerContainer>();

Object.defineProperty(mockServiceWorker, 'controller', {
  value: mockServiceWorkerController,
  writable: true,
});

Object.defineProperty(mockServiceWorker, 'ready', {
  value: Promise.resolve(mockServiceWorkerController),
  writable: true,
});
