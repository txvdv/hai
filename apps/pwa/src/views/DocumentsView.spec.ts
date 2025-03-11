import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper, createWrapperError, DOMWrapper } from '@vue/test-utils';
import DocumentsView from './DocumentsView.vue';
import * as mod from '../service/document-service';

// Set up the initial state
let mockDocuments = [
  {
    id: '123',
    content: 'Document 1',
  },
  {
    id: '456',
    content: 'Document 2',
  },
];
const DocumentServiceMock = vi.fn();
DocumentServiceMock.prototype.getDocuments = vi.fn().mockResolvedValue(mockDocuments);
DocumentServiceMock.prototype.createDocument = vi.fn().mockResolvedValue({
  id: '789',
  content: 'New Document',
});
DocumentServiceMock.prototype.updateDocument = vi.fn().mockResolvedValue({
  id: '123',
  content: 'Updated Document 1',
});
DocumentServiceMock.prototype.deleteDocument = vi
  .fn()
  .mockResolvedValue(undefined);

vi.spyOn(mod, 'DocumentService').mockImplementation(DocumentServiceMock);

describe('DocumentsView', () => {
  let documentService: mod.DocumentService;
  let wrapper: VueWrapper<typeof DocumentsView>;

  const doDeleteDocument = (id: string) => {
    wrapper.vm.deleteDocument(id);
  };
  const doEditDocument = (id: string) => {
    wrapper.vm.editDocument(id);
  };
  const domDocumentInput = () => {
    return wrapper.find('textarea');
  };
  const domSave = () => {
    return wrapper.find('button.btn-light');
  };
  const domText = () => {
    return wrapper.text();
  };

  beforeEach(async () => {
    documentService = new DocumentServiceMock();
    wrapper = mount(DocumentsView, {
      global: {
        provide: {
          core: {
            documentService: documentService,
          },
        },
        stubs: {
          'router-link': true, // Stub the router-link
        },
      },
    });
    // await flushPromises();
  });

  it('renders a list of documents', async () => {
    expect(documentService.getDocuments).toHaveBeenCalled();
    expect(domText()).toContain('Document 1');
    expect(domText()).toContain('Document 2');
  });

  it('creates a new document', async () => {
    await domDocumentInput().setValue('New Document');
    await domSave().trigger('click');

    expect(documentService.createDocument).toHaveBeenCalledWith('New Document');
    expect(documentService.getDocuments).toHaveBeenCalled();
  });

  it('updates an existing document', async () => {
    doEditDocument('123');
    await flushPromises();
    expect(domDocumentInput().element.value).toBe('Document 1');
    await domDocumentInput().setValue('Updated Document 1');

    await domSave().trigger('click');

    expect(documentService.updateDocument).toHaveBeenCalledWith(
      '123',
      'Updated Document 1'
    );
    expect(documentService.getDocuments).toHaveBeenCalled();
  });

  it('deletes a document', async () => {
    doDeleteDocument('123');
    await flushPromises();

    expect(documentService.deleteDocument).toHaveBeenCalledWith('123');
    expect(documentService.getDocuments).toHaveBeenCalled();
  });

  it('resets the document when creating a new one', async () => {
    const vmDoc = () => wrapper.vm.doc;

    wrapper.vm.editDocument('123');
    await flushPromises();
    expect(vmDoc().id).toBe('123');
    expect(vmDoc().content).toBe('Document 1');

    wrapper.vm.newDocument();
    await flushPromises();
    expect(vmDoc().id).toBe('');
    expect(vmDoc().content).toBe('');
  });

  it('handles editing a document', async () => {
    wrapper.vm.editDocument('456');
    await flushPromises();

    const doc = wrapper.vm.doc;
    expect(doc.id).toBe('456');
    expect(doc.content).toBe('Document 2');
  });

  it('renders correctly after deleting a document', async () => {
    // Mock the `getDocuments` method to return the current state
    documentService.getDocuments = vi
      .fn()
      .mockImplementation(() => Promise.resolve(mockDocuments));

    // Mock the `deleteDocument` method to update the state dynamically
    documentService.deleteDocument = vi.fn().mockImplementation((id) => {
      mockDocuments = mockDocuments.filter((doc) => doc.id !== id); // Remove the deleted document
      return Promise.resolve();
    });

    wrapper.vm.deleteDocument('456');
    await flushPromises();
    expect(documentService.deleteDocument).toHaveBeenCalledWith('456');
    expect(domText()).not.toContain('Document 2');
  });
});

// Utility function to wait for promises to resolve
export function flushPromises(): Promise<void> {
  return new Promise(setImmediate);
}

// Get all elements with the given text.
const getAllByText = (wrapper:VueWrapper, text: string) => {
  return wrapper.findAll("*").filter(node => node.text() === text)
}

// Get the first element that has the given text.
// @ts-ignore
function getByText(wrapper:VueWrapper, text: string) {
  const results = getAllByText(wrapper, text)
  if (results.length === 0) {
    throw new Error(`getByText() found no element with the text: "${text}".`)
  }
  return results.at(0)
}

// @ts-ignore
function findByText(wrapper: VueWrapper, str: string, selector = '*'): DOMWrapper<any> {
  const items = wrapper.findAll(selector);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.text().trim() === str.trim()) {
      return item;
    }
  }

  return createWrapperError('DOMWrapper');
}