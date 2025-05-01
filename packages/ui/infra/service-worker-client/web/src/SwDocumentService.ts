import { createUUID } from '@hai/common-utils';
import {
  RequestMessageEnvelope,
  ResponseMessageEnvelope,
} from '@hai/api-messaging';
import type { DocumentComponents } from '@hai/api-messaging';
import { err, ok, Result, DocumentService } from '@hai/ui-core-new';

type Document = DocumentComponents['schemas']['Document'];
type CreateDocumentPayload = DocumentComponents['schemas']['CreateDocument'];
type CreateDocumentResponse =
  DocumentComponents['schemas']['CreateDocumentResponse'];
type DeleteDocumentPayload = DocumentComponents['schemas']['DeleteDocument'];
type GetDocumentPayload = DocumentComponents['schemas']['GetDocument'];
type GetDocumentResponse = DocumentComponents['schemas']['GetDocumentResponse'];
type GetDocumentsResponse =
  DocumentComponents['schemas']['GetDocumentsResponse'];
type UpdateDocumentPayload = DocumentComponents['schemas']['UpdateDocument'];

export class SwDocumentService implements DocumentService {
  async createDocument(
    payload: CreateDocumentPayload
  ): Promise<Result<{ id: string }>> {
    const res = await sendAndAwaitServiceWorker<CreateDocumentResponse>(
      '/documents',
      'CreateDocument',
      payload
    );
    if (res.status === 'success') {
      return ok(res.payload);
    } else {
      return err(res.payload);
    }
  }

  async deleteDocument(payload: DeleteDocumentPayload): Promise<Result<void>> {
    const res = await sendAndAwaitServiceWorker(
      '/documents',
      'DeleteDocument',
      payload
    );
    if (res.status === 'success') {
      return ok(undefined);
    } else {
      return err(res.payload);
    }
  }

  async getDocument(payload: GetDocumentPayload): Promise<Result<Document>> {
    const res = await sendAndAwaitServiceWorker<GetDocumentResponse>(
      '/documents',
      'GetDocument',
      payload
    );
    if (res.status === 'success') {
      return ok(res.payload);
    } else {
      return err(res.payload);
    }
  }

  async getDocuments(): Promise<Result<Document[]>> {
    const res = await sendAndAwaitServiceWorker<GetDocumentsResponse>(
      '/documents',
      'GetDocuments',
      undefined
    );
    if (res.status === 'success') {
      return ok(res.payload);
    } else {
      return err(res.payload);
    }
  }

  async updateDocument(payload: UpdateDocumentPayload): Promise<Result<void>> {
    const res = await sendAndAwaitServiceWorker(
      '/documents',
      'UpdateDocument',
      payload
    );
    if (res.status === 'success') {
      return ok(undefined);
    } else {
      return err(res.payload);
    }
  }
}

async function sendAndAwaitServiceWorker<T>(
  path: string,
  type: string,
  payload: unknown,
  timeoutInMs = 5000
): Promise<ResponseMessageEnvelope<T>> {
  if (!navigator.serviceWorker.controller) {
    // TODO: better format for UI response
    // build a Problem Details and issue a popup
    throw new Error('Service worker controller not available.');
  }

  const correlationId = createUUID();

  const reqMsg: RequestMessageEnvelope<unknown> = {
    type,
    payload,
    metadata: {
      messageId: createUUID(),
      messagePath: path,
      correlationId,
      timestamp: new Date().toISOString(),
    },
  };

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new Error(
          `No response received for correlationId ${correlationId} within ${timeoutInMs}ms`
        )
      );
      navigator.serviceWorker.removeEventListener('message', messageHandler);
    }, timeoutInMs);

    // Listen for messages from the service worker
    function messageHandler(event: MessageEvent<any>) {
      const response = event.data;

      if (response.metadata?.correlationId === correlationId) {
        clearTimeout(timeout);
        resolve(response);
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      }
    }

    navigator.serviceWorker.addEventListener('message', messageHandler);

    // Post the message to the service worker
    navigator!.serviceWorker!.controller!.postMessage(reqMsg);
  });
}
