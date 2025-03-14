// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from '@storybook/test';
// @ts-ignore
import DocumentEditor from './DocumentEditor.vue';

/**
 * Issue: Vue3 Automatic inference argTypes don't work well
 * https://github.com/storybookjs/storybook/issues/23079
 */
export const ActionsData = {
  // Note: doesn't work, probably due to debouncing
  onUpdateModelValue: fn(),
};

const meta: Meta<typeof DocumentEditor> = {
  title: 'Organisms/DocumentEditor',
  component: DocumentEditor,
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
    modelValue: '',
  },
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    modelValue: '',
  },
};
