import { DocumentService } from '@hai/core-service';
import {
  buildMessageResponse,
  MessageEnvelope,
  MessageResponse,
} from './app-messaging.js';

export class DocumentController {
  private readonly documentService: DocumentService;

  constructor(documentService: DocumentService) {
    this.documentService = documentService;
  }

  async handle(msg: MessageEnvelope): Promise<MessageResponse<any>> {
    const { metadata } = msg;
    const { correlationId } = metadata;

    if (!correlationId) {
      throw new Error('correlationId must be provided.');
    }

    try {
      switch (msg.type) {
        case 'Document.Create':
          return await this.handleCreateDocument(msg);

        case 'Document.Delete':
          return await this.handleDeleteDocument(msg);

        case 'Document.Get':
          return await this.handleGetDocument(msg);

        case 'Document.List':
          return await this.handleListDocuments(msg);

        case 'Document.Update':
          return await this.handleUpdateDocument(msg);

        default:
          return this.handleUnknownType(msg);
      }
    } catch (err) {
      return buildMessageResponse(msg.type, 'error', {
        payload: {
          title: 'Error',
          detail:
            err instanceof Error
              ? err.message
              : 'An unknown error occurred while processing the document message.',
        },
        correlationId,
      });
    }
  }

  private async handleCreateDocument(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    const { metadata, payload } = msg;
    const { correlationId } = metadata;

    try {
      const result = await this.documentService.createDocument(payload);
      if (result.success) {
        return buildMessageResponse('Document.Create.Response', 'success', {
          payload: result.data,
          correlationId,
        });
      } else {
        return buildMessageResponse('Document.Create.Response', 'error', {
          payload: {
            title: 'Error',
            detail:
              result.error || 'Something went wrong creating the document.',
          },
          correlationId,
        });
      }
    } catch (err) {
      return buildMessageResponse('Document.Create.Response', 'error', {
        payload: {
          title: 'Failed to Create Document',
          detail:
            err instanceof Error
              ? err.message
              : 'An unknown error occurred while creating the document.',
        },
        correlationId,
      });
    }
  }

  private async handleDeleteDocument(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    const { metadata, payload } = msg;
    const { correlationId } = metadata;

    try {
      const result = await this.documentService.deleteDocument(payload.id);
      if (result.success) {
        return buildMessageResponse('Document.Delete.Response', 'success', {
          payload: { id: payload.id },
          correlationId,
        });
      } else {
        return buildMessageResponse('Document.Delete.Response', 'error', {
          payload: {
            title: 'Failed to Delete Document',
            detail: 'An unknown error occurred while deleting the document.',
          },
          correlationId,
        });
      }
    } catch (err) {
      return buildMessageResponse('Document.Delete.Response', 'error', {
        payload: {
          title: 'Failed to Delete Document',
          detail:
            err instanceof Error
              ? err.message
              : 'An unknown error occurred while deleting the document.',
        },
        correlationId,
      });
    }
  }

  private async handleGetDocument(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    const { metadata, payload } = msg;
    const { id } = payload;
    const { correlationId } = metadata;

    try {
      const result = await this.documentService.getDocument({ id });
      if (result.success) {
        return buildMessageResponse('Document.Get.Response', 'success', {
          payload: result.data,
          correlationId,
        });
      } else {
        return buildMessageResponse('Document.Get.Response', 'error', {
          payload: {
            title: 'Error',
            detail:
              result.error || 'Something went wrong getting the document.',
          },
          correlationId,
        });
      }
    } catch (err) {
      return buildMessageResponse('Document.Get.Response', 'error', {
        payload: {
          title: 'Failed to get Document',
          detail:
            err instanceof Error
              ? err.message
              : 'An unknown error occurred while getting the document.',
        },
        correlationId,
      });
    }
  }

  private async handleListDocuments(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    const { metadata } = msg;
    const { correlationId } = metadata;

    try {
      const result = await this.documentService.getDocuments();
      if (result.success) {
        return buildMessageResponse('Document.List.Response', 'success', {
          payload: { documents: result.data },
          correlationId,
        });
      } else {
        return buildMessageResponse('Document.List.Response', 'error', {
          payload: {
            title: 'Error',
            detail: result.error,
          },
          correlationId,
        });
      }
    } catch (err) {
      return buildMessageResponse('Document.List.Response', 'error', {
        payload: {
          title: 'Failed to List Documents',
          detail:
            err instanceof Error
              ? err.message
              : 'An unknown error occurred while getting the documents.',
        },
        correlationId,
      });
    }
  }

  private async handleUpdateDocument(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    const { metadata, payload } = msg;
    const { id, content } = payload;
    const { correlationId } = metadata;

    try {
      const result = await this.documentService.updateDocument({
        id,
        content,
      });
      if (result.success) {
        return buildMessageResponse('Document.Update.Response', 'success', {
          payload: { id, content },
          correlationId,
        });
      } else {
        return buildMessageResponse('Document.Update.Response', 'error', {
          payload: {
            title: 'Error',
            detail:
              result.error || 'Something went wrong updating the document.',
          },
          correlationId,
        });
      }
    } catch (err) {
      return buildMessageResponse('Document.Update.Response', 'error', {
        payload: {
          title: 'Failed to Update Document',
          detail:
            err instanceof Error
              ? err.message
              : 'An unknown error occurred while updating the document.',
        },
        correlationId,
      });
    }
  }

  private handleUnknownType(
    msg: MessageEnvelope
  ): Promise<MessageResponse<any>> {
    const { metadata, type } = msg;
    const { correlationId } = metadata;

    return Promise.resolve(
      buildMessageResponse(type, 'error', {
        payload: {
          title: 'Unsupported Document Message Type',
          detail: `The message type "${type}" is not recognized by the DocumentController.`,
        },
        correlationId,
      })
    );
  }
}
