import { MockProxy, mock } from 'vitest-mock-extended';
import { DocumentService } from './document-service.js';

export type MockDocumentService = MockProxy<DocumentService>;

export const createMockDocumentService = (
  overrides = {}
): MockDocumentService => {
  const mockDocService: MockDocumentService = mock<DocumentService>();

  mockDocService.getDocuments.mockResolvedValue({
    status: 'success',
    payload: { documents: [] },
    ...overrides,
  });

  mockDocService.createDocument.mockResolvedValue({
    status: 'success',
    payload: { id: 'default-id', content: 'default-content' },
  });

  mockDocService.updateDocument.mockResolvedValue({
    status: 'success',
    payload: { id: 'default-id', content: 'updated-content' },
  });

  return mockDocService;
};
