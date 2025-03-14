// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/vue3';
// @ts-ignore
import ComposerTemplate from './ComposerTemplate.vue';

const meta: Meta<typeof ComposerTemplate> = {
  title: 'Templates/ComposerTemplate',
  component: ComposerTemplate,
  tags: ['!autodocs'],
  args: {},
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
