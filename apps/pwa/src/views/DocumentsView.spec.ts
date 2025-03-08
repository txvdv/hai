import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount , VueWrapper } from '@vue/test-utils';
import DocumentsView from './DocumentsView.vue';
import * as mod from '../service/document-service';

const DocumentServiceMock = vi.fn();

DocumentServiceMock.prototype.getDocuments = vi.fn().mockResolvedValue([
  { id: '123', content: 'Document 1' },
  { id: '456', content: 'Document 2' }
]);
DocumentServiceMock.prototype.createDocument = vi.fn().mockResolvedValue({ id: '789', content: 'New Document' });
DocumentServiceMock.prototype.updateDocument = vi.fn().mockResolvedValue({ id: '123', content: 'Updated Document 1' });
DocumentServiceMock.prototype.deleteDocument = vi.fn().mockResolvedValue(undefined);

vi.spyOn(mod, 'DocumentService').mockImplementation(DocumentServiceMock);

describe('WorkerView', () => {
  let documentService: mod.DocumentService;
  let wrapper: VueWrapper<typeof DocumentsView>;

  beforeEach(async () => {
    documentService = new DocumentServiceMock();
    wrapper = mount(DocumentsView, {
      global: {
        provide: {
          core: {
            documentService: documentService
          }
        }
      }
    });
    await flushPromises();
  });

  it('renders a list of documents', async () => {
    expect(documentService.getDocuments).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Document 1');
    expect(wrapper.text()).toContain('Document 2');
  });

  it('creates a new document', async () => {
    const textarea = wrapper.find('textarea');
    await textarea.setValue('New Document');
    const saveButton = wrapper.find('button.btn-light');
    await saveButton.trigger('click');

    expect(documentService.createDocument).toHaveBeenCalledWith('New Document');
    expect(documentService.getDocuments).toHaveBeenCalled();
  });

  it('updates an existing document', async () => {
    wrapper.vm.editDocument('123');
    await flushPromises();
    const textarea = wrapper.find('textarea');
    expect(textarea.element.value).toBe('Document 1');
    await textarea.setValue('Updated Document 1');

    const saveButton = wrapper.find('button.btn-light');
    await saveButton.trigger('click');

    expect(documentService.updateDocument).toHaveBeenCalledWith('123', 'Updated Document 1');
    expect(documentService.getDocuments).toHaveBeenCalled();
  });

  it('deletes a document', async () => {
    wrapper.vm.deleteDocument('123');
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
    // Set up the initial state
    let mockDocuments = [
      { id: '123', content: 'Document 1' },
      { id: '456', content: 'Document 2' }
    ];

    // Mock the `getDocuments` method to return the current state
    documentService.getDocuments = vi.fn().mockImplementation(() => Promise.resolve(mockDocuments));

    // Mock the `deleteDocument` method to update the state dynamically
    documentService.deleteDocument = vi.fn().mockImplementation((id) => {
      mockDocuments = mockDocuments.filter((doc) => doc.id !== id); // Remove the deleted document
      return Promise.resolve();
    });

    wrapper.vm.deleteDocument('456');
    await flushPromises();
    expect(documentService.deleteDocument).toHaveBeenCalledWith('456');
    expect(wrapper.text()).not.toContain('Document 2');
  });
});

// Utility function to wait for promises to resolve
export function flushPromises(): Promise<void> {
  return new Promise(setImmediate);
}