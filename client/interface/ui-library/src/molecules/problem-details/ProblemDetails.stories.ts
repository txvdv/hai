// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from '@storybook/test';
// @ts-ignore
import ProblemDetails from './ProblemDetails.vue';

/**
 * Issue: Vue3 Automatic inference argTypes don't work well
 * https://github.com/storybookjs/storybook/issues/23079
 */
export const ActionsData = {
  onViewDoc: fn(),
};

const meta: Meta<typeof ProblemDetails> = {
  title: 'Molecules/ProblemDetails/ProblemDetails',
  component: ProblemDetails,
  excludeStories: /.*Data$/,
  args: {},
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
