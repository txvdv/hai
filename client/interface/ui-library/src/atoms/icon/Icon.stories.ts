// noinspection HtmlUnknownAttribute,JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/vue3';
// @ts-ignore
import Icon from './Icon.vue';
import { icons } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  args: {
    color: 'text',
    name: 'home',
    size: 'md',
  },
  argTypes: {
    color: {
      description: 'Icon color',
      control: 'select',
      options: [
        'text',
        'text-inverse',
        'primary',
        'success',
        'secondary',
        'danger',
        'warn',
      ],
    },
    name: {
      description: 'the name of the icon to display',
      control: 'select',
      options: Object.keys(icons),
    },
    size: {
      description:
        'Icon size. Use predefined sizes (sm, md, lg, xl), number for pixels, or custom value with units',
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      allowArbitraryValue: true,
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const HomeIcon: Story = {
  args: {
    name: 'home',
  },
};

export const IconGallery: Story = {
  render: () => ({
    components: { AppIcon: Icon },
    setup() {
      const iconNames = Object.keys(icons);
      return { iconNames };
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem;">
        <div v-for="name in iconNames" :key="name" style="text-align: center;">
          <AppIcon :name="name" size="md" />
          <div style="font-size: 0.8rem; margin-top: 0.5rem;">{{name}}</div>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Gallery of all available icons',
      },
    },
  },
};

export const PredefinedSizes: Story = {
  render: () => ({
    components: { AppIcon: Icon },
    template: `
      <div style="display: flex; gap: 1rem; align-items: center;">
        <div v-for="foo of bar">Predefined Sizes</div>
        <AppIcon name="home" size="sm" />
        <AppIcon name="home" size="md" />
        <AppIcon name="home" size="lg" />
        <AppIcon name="home" size="xl" />
      </div>
    `,
  }),
};

export const NumericSize: Story = {
  args: {
    name: 'home',
    size: '40',
  },
};

export const CustomUnitSize: Story = {
  args: {
    name: 'home',
    size: '3rem',
  },
};

export const EmSize: Story = {
  args: {
    name: 'home',
    size: '2.5em',
  },
};
