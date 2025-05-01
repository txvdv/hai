import {
  createResponseMessage,
  DocumentComponents,
  DocumentsPaths,
  ProblemDetails,
  RequestMessageEnvelope,
  ResponseMessageEnvelope,
} from '@hai/api-messaging';
import {
  CreateDocumentCommand,
  CreateDocumentResult,
  DeleteDocumentCommand,
  GetDocumentQuery,
  GetDocumentsQuery,
  MessageDispatcher,
  UpdateDocumentCommand,
} from '@hai/service-core';

export const DocumentsPath: keyof DocumentsPaths = '/documents';

// -----------------------------------------------------------------------------
// Message Types
// -----------------------------------------------------------------------------
type CommandMessage =
  DocumentsPaths['/documents']['post']['parameters']['header']['X-Message-Type'];
type QueryMessage =
  DocumentsPaths['/documents']['get']['parameters']['header']['X-Message-Type'];
const CreateDocument: CommandMessage = 'CreateDocument';
type CreateDocumentPayload = DocumentComponents['schemas']['CreateDocument'];
type CreateDocumentResponse =
  DocumentComponents['schemas']['CreateDocumentResponse'];
const DeleteDocument: CommandMessage = 'DeleteDocument';
type DeleteDocumentPayload = DocumentComponents['schemas']['DeleteDocument'];
const GetDocument: QueryMessage = 'GetDocument';
type GetDocumentPayload = DocumentComponents['schemas']['GetDocument'];
type GetDocumentResponse = DocumentComponents['schemas']['GetDocumentResponse'];
const GetDocuments: QueryMessage = 'GetDocuments';
type GetDocumentsPayload = DocumentComponents['schemas']['GetDocuments'];
type GetDocumentsResponse =
  DocumentComponents['schemas']['GetDocumentsResponse'];
const UpdateDocument: CommandMessage = 'UpdateDocument';
type UpdateDocumentPayload = DocumentComponents['schemas']['UpdateDocument'];

// -----------------------------------------------------------------------------
// Message Controller
// -----------------------------------------------------------------------------
export class DocumentsController {
  private readonly messageDispatcher: MessageDispatcher;

  constructor(messageDispatcher: MessageDispatcher) {
    this.messageDispatcher = messageDispatcher;
  }

  async handle(
    req: RequestMessageEnvelope<any>
  ): Promise<ResponseMessageEnvelope<any>> {
    switch (req.type) {
      case CreateDocument:
        return this.handleCreateDocument(req);
      case DeleteDocument:
        return this.handleDeleteDocument(req);
      case GetDocument:
        return this.handleGetDocument(req);
      case GetDocuments:
        return this.handleGetDocuments(req);
      case UpdateDocument:
        return this.handleUpdateDocument(req);
      default:
        throw new Error(`Unknown message type: ${req.type}`);
    }
  }

  private async handleCreateDocument(
    req: RequestMessageEnvelope<CreateDocumentPayload>
  ): Promise<ResponseMessageEnvelope<CreateDocumentResponse>> {
    const { payload } = req;

    const result = await this.messageDispatcher.sendAndWait<
      CreateDocumentCommand,
      CreateDocumentResult
    >(
      CreateDocumentCommand.createWith({
        content: payload.content,
      })
    );

    if (result.success) {
      return createResponseMessage(req, 'success', result.data);
    } else {
      const problemDetails: ProblemDetails = {
        type: '/errors/create-document',
        title: 'Failed to create document',
        detail: 'Unknown Error',
      };
      return createResponseMessage(req, 'error', problemDetails);
    }
  }

  private async handleDeleteDocument(
    req: RequestMessageEnvelope<DeleteDocumentPayload>
  ): Promise<ResponseMessageEnvelope<void>> {
    const { payload } = req;

    const result = await this.messageDispatcher.sendAndWait(
      new DeleteDocumentCommand(payload.id)
    );

    if (result.success) {
      return createResponseMessage(req, 'success');
    } else {
      const problemDetails: ProblemDetails = {
        type: '/errors/delete-document',
        title: 'Failed to delete document',
        detail: 'Unknown Error',
      };
      return createResponseMessage(req, 'error', problemDetails);
    }
  }

  private async handleGetDocument(
    req: RequestMessageEnvelope<GetDocumentPayload>
  ): Promise<ResponseMessageEnvelope<GetDocumentResponse>> {
    const { payload } = req;

    const result = await this.messageDispatcher.sendAndWait(
      new GetDocumentQuery(payload.id)
    );

    if (result.success) {
      return createResponseMessage(req, 'success', result.data);
    } else {
      const problemDetails: ProblemDetails = {
        type: '/errors/delete-document',
        title: 'Failed to delete document',
        detail: 'Unknown Error',
      };
      return createResponseMessage(req, 'error', problemDetails);
    }
  }

  private async handleGetDocuments(
    req: RequestMessageEnvelope<GetDocumentsPayload>
  ): Promise<ResponseMessageEnvelope<GetDocumentsResponse>> {
    const result = await this.messageDispatcher.sendAndWait(
      new GetDocumentsQuery()
    );

    if (result.success) {
      return createResponseMessage(req, 'success', result.data);
    } else {
      const problemDetails: ProblemDetails = {
        type: '/errors/delete-document',
        title: 'Failed to delete document',
        detail: 'Unknown Error',
      };
      return createResponseMessage(req, 'error', problemDetails);
    }
  }

  private async handleUpdateDocument(
    req: RequestMessageEnvelope<UpdateDocumentPayload>
  ): Promise<ResponseMessageEnvelope<void>> {
    const { payload } = req;

    const result = await this.messageDispatcher.sendAndWait(
      new UpdateDocumentCommand(payload.id, payload.content)
    );

    if (result.success) {
      return createResponseMessage(req, 'success');
    } else {
      const problemDetails: ProblemDetails = {
        type: '/errors/update-document',
        title: 'Failed to update document',
        detail: 'Unknown Error',
      };
      return createResponseMessage(req, 'error', problemDetails);
    }
  }
}
