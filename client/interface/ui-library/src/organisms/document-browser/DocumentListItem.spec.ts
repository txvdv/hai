import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DocumentListItem from './DocumentListItem.vue';
import PrimeButton from 'primevue/button';

describe('DocumentListItem', () => {
  const mockDocument = {
    id: 'doc123',
    content: 'Sample document content',
  };

  it('renders the document content properly via props', () => {
    const wrapper = mount(DocumentListItem, {
      props: {
        document: mockDocument,
      },
    });

    // Assert that the content is rendered
    expect(wrapper.text()).toContain(mockDocument.content);
  });

  it('renders a PrimeButton with the label "View"', () => {
    const wrapper = mount(DocumentListItem, {
      props: {
        document: mockDocument,
      },
      global: {
        stubs: {
          PrimeButton,
        },
      },
    });

    const button = wrapper.findComponent(PrimeButton);

    // Assert that the PrimeButton has the correct label property
    expect(button.props('label')).toBe('View');
  });

  it('calls the viewDoc function and emits the "view-doc" event when the button is clicked', async () => {
    const wrapper = mount(DocumentListItem, {
      props: {
        document: mockDocument,
      },
      global: {
        stubs: {
          PrimeButton, // Stubbing the PrimeVue Button since it's a third-party component
        },
      },
    });

    // Assert no events emitted initially
    expect(wrapper.emitted('view-doc')).toBeFalsy();

    // Simulate Button Click
    await wrapper.findComponent(PrimeButton).trigger('click');

    // Assert that the 'view-doc' event is emitted with the correct payload
    expect(wrapper.emitted('view-doc')).toHaveLength(1);
    expect(wrapper.emitted('view-doc')![0]).toEqual([mockDocument.id]);
  });
});
