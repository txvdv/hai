import { mount } from '@vue/test-utils';
import Icon from './Icon.vue';

vi.mock('./Icon', () => {
  return {
    icons: {
      'mock-icon': 'M10 10 L20 20', // Mock icon path for test
    },
  };
});

describe('AppIcon', () => {
  it('renders the component', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon' },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('sets the correct icon path based on the `name` prop', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon' },
    });

    const pathElement = wrapper.find('path');
    expect(pathElement.attributes('d')).toBe('M10 10 L20 20'); // Verify mocked path
  });

  it('applies styles based on the `size` prop (predefined sizes)', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon', size: 'lg' },
    });

    const svgElement = wrapper.find('svg');
    expect(svgElement.attributes('style')).toContain('width: 32px;');
    expect(svgElement.attributes('style')).toContain('height: 32px;');
  });

  it('applies styles based on the `size` prop (numeric value)', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon', size: 50 },
    });

    const svgElement = wrapper.find('svg');
    expect(svgElement.attributes('style')).toContain('width: 50px;');
    expect(svgElement.attributes('style')).toContain('height: 50px;');
  });

  it('applies styles based on the `size` prop (custom string value)', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon', size: '4rem' },
    });

    const svgElement = wrapper.find('svg');
    expect(svgElement.attributes('style')).toContain('width: 4rem;');
    expect(svgElement.attributes('style')).toContain('height: 4rem;');
  });

  it('uses the default size when no `size` prop is provided', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon' },
    });

    const svgElement = wrapper.find('svg');
    expect(svgElement.attributes('style')).toContain('width: 24px;');
    expect(svgElement.attributes('style')).toContain('height: 24px;');
  });

  it('applies the correct fill color based on the `color` prop', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon', color: 'primary' },
    });

    const svgElement = wrapper.find('svg');
    expect(svgElement.attributes('style')).toContain(
      'fill: var(--color-primary-500);'
    );
  });

  it('uses the default color when no `color` prop is provided', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon' },
    });

    const svgElement = wrapper.find('svg');
    expect(svgElement.attributes('style')).toContain(
      'fill: var(--p-text-color);'
    );
  });

  it('renders a <title> element with the icon name', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon' },
    });

    const titleElement = wrapper.find('title');
    expect(titleElement.text()).toBe('mock-icon');
  });

  it('applies custom size if prop size is a purely numeric string', () => {
    const wrapper = mount(Icon, {
      props: { name: 'mock-icon', size: '64' },
    });

    const svgElement = wrapper.find('svg');
    expect(svgElement.attributes('style')).toContain('width: 64px;');
    expect(svgElement.attributes('style')).toContain('height: 64px;');
  });
});
