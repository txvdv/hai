import { mock, MockProxy } from 'vitest-mock-extended';
import {
  createRequestMessage,
  RequestMessageEnvelope,
} from '../messaging-infra/index.js';
import { DocumentsController } from './document.controller.js';
import { MessageDispatcher } from '@hai/core-service';

// Message types
const CreateDocument = 'CreateDocument';
const DeleteDocument = 'DeleteDocument';
const UpdateDocument = 'UpdateDocument';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let messageDispatcher: MockProxy<MessageDispatcher>;

  beforeEach(() => {
    messageDispatcher = mock<MessageDispatcher>();
    controller = new DocumentsController(messageDispatcher);
  });

  describe('CreateDocument', () => {
    test('should return payload', async () => {
      const CreateDocumentPayload = {
        content: 'Document content',
      };

      const req = createRequestMessage(
        '/documents',
        CreateDocument,
        CreateDocumentPayload
      );

      messageDispatcher.sendAndWait.mockResolvedValue({
        success: true,
        data: { id: '123' },
      });

      const res = await controller.handle(req);
      expect(res.payload).toEqual({ id: '123' });
    });

    test('should fail', async () => {
      const CreateDocumentPayload = {
        content: 'Document content',
      };

      const req: RequestMessageEnvelope<typeof CreateDocumentPayload> = {
        type: CreateDocument,
        metadata: {
          correlationId: '123',
          messageId: '123',
          messagePath: '/documents',
          timestamp: new Date().toISOString(),
        },
        payload: CreateDocumentPayload,
      };

      messageDispatcher.sendAndWait.mockResolvedValue({
        success: false,
        error: 'issue',
      });

      const res = await controller.handle(req);
      expect(res.payload).toEqual(
        expect.objectContaining({ title: expect.any(String) })
      );
    });
  });

  describe('DeleteDocument', () => {
    test('should return payload', async () => {
      const DeleteDocumentPayload = {
        id: '123',
      };

      const req: RequestMessageEnvelope<typeof DeleteDocumentPayload> = {
        type: DeleteDocument,
        metadata: {
          correlationId: '123',
          messageId: '125',
          messagePath: '/documents',
          timestamp: new Date().toISOString(),
        },
        payload: DeleteDocumentPayload,
      };

      const res = await controller.handle(req);
      expect(res.payload).toEqual(DeleteDocumentPayload);
    });
  });

  describe('UpdateDocument', () => {
    test('should return payload', async () => {
      const UpdateDocumentPayload = {
        id: '123',
        content: 'Updated content',
      };

      const req: RequestMessageEnvelope<typeof UpdateDocumentPayload> = {
        type: UpdateDocument,
        metadata: {
          correlationId: '123',
          messageId: '124',
          messagePath: '/documents',
          timestamp: new Date().toISOString(),
        },
        payload: UpdateDocumentPayload,
      };

      const res = await controller.handle(req);
      expect(res.status).toEqual('success');
      expect(res.payload).toBeUndefined();
    });
  });
});
