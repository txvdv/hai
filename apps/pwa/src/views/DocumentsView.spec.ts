import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper, createWrapperError, DOMWrapper, ComponentMountingOptions } from '@vue/test-utils';
import DocumentsView from './DocumentsView.vue';
import { MockProxy, mock } from 'vitest-mock-extended';
import {DocumentService} from '../service/document-service';

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

describe('DocumentsView', () => {
  let mockServiceWorkerController: MockProxy<ServiceWorker>;
  let mockServiceWorker: MockProxy<ServiceWorkerContainer>;
  let mockDocService: MockProxy<DocumentService>;
  let wrapper: VueWrapper<typeof DocumentsView>;
  let mountOptions: ComponentMountingOptions<typeof DocumentsView>

  // delayed do mount due to service call onMount
  const doMount = async () => {
    wrapper = mount(DocumentsView, mountOptions);
    await flushPromises();
  }

  beforeEach(async () => {
    mockDocService = mock<DocumentService>();
    mockDocService.getDocuments.mockResolvedValue([])

    mockServiceWorkerController = mock<ServiceWorker>();
    mockServiceWorker = mock<ServiceWorkerContainer>();
    Object.defineProperty(mockServiceWorker, 'controller', {
      value: mockServiceWorkerController,
      writable: true,
    });
    Object.defineProperty(mockServiceWorker, 'ready', {
      value: Promise.resolve(),
      writable: true,
    });
    Object.defineProperty(navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
    });

    mountOptions = {
      global: {
        provide: {
          core: {
            documentService: mockDocService,
          },
        },
        stubs: {
          'router-link': true, // Stub the router-link
        },
      },
    }
  });

  it('fetches the document on mount', async () => {
    await doMount()
    expect(mockDocService.getDocuments).toHaveBeenCalled();
  });

  it('shows a message when there is no content yet created', async () => {
    await doMount()
    expect(wrapper.text()).toContain('Create your first document');
  });

  it('shows the textarea when create a document is clicked', async () => {
    await doMount()
    const createBtn = wrapper.find('button[aria-label="Create Document"]');
    await createBtn.trigger('click');
    expect(wrapper.find('#document').isVisible()).toBe(true);
    const saveBtn = wrapper.find('button[aria-label="Save Document"]');
    expect (saveBtn.attributes('disabled')).toBe('')
  });

  it('saves new content', async () => {
    await doMount()
    const createBtn = wrapper.find('button[aria-label="Create Document"]');
    await createBtn.trigger('click');
    await wrapper.find('textarea').setValue('New Document');
    const saveBtn = wrapper.find('button[aria-label="Save Document"]');
    await saveBtn.trigger('click')
    expect(mockDocService.createDocument).toHaveBeenCalledWith('New Document');
    expect(mockDocService.getDocuments).toHaveBeenCalled();
  })

  it('updates a document', async () => {
    mockDocService.getDocuments.mockResolvedValue(mockDocuments);

    await doMount();

    const editBtn = wrapper.findAll(`button[aria-label="Edit Document"]`).at(0);
    if (!editBtn) throw new Error('Edit button not found');
    await editBtn.trigger('click');

    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);

    await textarea.setValue('Updated Document 123');
    const saveBtn = wrapper.find('button[aria-label="Save Document"]');
    await saveBtn.trigger('click');

    expect(mockDocService.updateDocument).toHaveBeenCalledWith(
      '123',
      'Updated Document 123'
    );
    expect(mockDocService.getDocuments).toHaveBeenCalled();
  });

  it('removes a document from the rendered list after deletion', async () => {
    mockDocService.getDocuments.mockResolvedValue(mockDocuments);

    await doMount();

    expect(wrapper.text()).toContain('Document 1');
    expect(wrapper.text()).toContain('Document 2');

    mockDocService.getDocuments.mockResolvedValue([mockDocuments[0]]);

    const deleteBtn = wrapper.findAll(`button[aria-label="Delete Document"]`).at(1);
    if (!deleteBtn) throw new Error('Delete button not found');
    await deleteBtn.trigger('click');

    expect(mockDocService.deleteDocument).toHaveBeenCalledWith('456');
    expect(mockDocService.getDocuments).toHaveBeenCalledTimes(2); // Once during mount, and once after delete
    expect(wrapper.text()).not.toContain('Document 2');
    expect(wrapper.text()).toContain('Document 1');
  });

  it('renders a list of documents', async () => {
    mockDocService.getDocuments.mockResolvedValue(mockDocuments);

    await doMount()

    expect(mockDocService.getDocuments).toHaveBeenCalled();
    expect(wrapper.text()).toContain('Document 1');
    expect(wrapper.text()).toContain('Document 2');
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