import { VueWrapper, createWrapperError, DOMWrapper } from '@vue/test-utils';

// Get all elements with the given text.
export const getAllByText = (wrapper: VueWrapper, text: string) => {
  return wrapper.findAll('*').filter((node) => node.text() === text);
};

// Get the first element that has the given text.
export function getByText(wrapper: VueWrapper, text: string) {
  const results = getAllByText(wrapper, text);
  if (results.length === 0) {
    throw new Error(`getByText() found no element with the text: "${text}".`);
  }
  return results.at(0);
}

export function findByText(
  wrapper: VueWrapper,
  str: string,
  selector = '*'
): DOMWrapper<any> {
  const items = wrapper.findAll(selector);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (item.text().trim() === str.trim()) {
      return item;
    }
  }

  return createWrapperError('DOMWrapper');
}
